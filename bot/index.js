import 'dotenv/config'
import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { Octokit } from 'octokit'

const {
  DISCORD_BOT_TOKEN,
  GITHUB_TOKEN,
  GITHUB_OWNER = 'nessaa26',
  GITHUB_REPO = 'cardtracker',
  DATA_FILE_PATH = 'src/data/community.json',
} = process.env

if (!DISCORD_BOT_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN is required in .env')
  process.exit(1)
}
if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN is required in .env (create a personal access token with repo scope)')
  process.exit(1)
}

const octokit = new Octokit({ auth: GITHUB_TOKEN })

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message],
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateId() {
  return `discord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function nowISO() {
  return new Date().toISOString()
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

const VALID_GAMES = ['pokemon', 'one_piece']
const VALID_STATUSES = ['rumored', 'announced', 'preorder', 'in_stock', 'out_of_stock', 'discontinued']
const VALID_REGIONS = ['US', 'CA', 'EU', 'UK', 'JP', 'AU', 'OTHER']

// ─── GitHub data read/write ─────────────────────────────────────────────────

async function fetchCommunityData() {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: DATA_FILE_PATH,
    })
    if ('content' in data) {
      const json = Buffer.from(data.content, 'base64').toString('utf-8')
      return { entries: JSON.parse(json), sha: data.sha }
    }
  } catch (err) {
    if (err.status === 404) {
      return { entries: [], sha: null }
    }
    throw err
  }
  return { entries: [], sha: null }
}

async function pushCommunityData(entries, sha) {
  const content = Buffer.from(JSON.stringify(entries, null, 2)).toString('base64')
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: DATA_FILE_PATH,
    message: `bot: update community card data (${entries.length} entries)`,
    content,
    sha: sha || undefined,
    committer: {
      name: 'Card Tracker Bot',
      email: 'bot@cardtracker.local',
    },
  })
}

// ─── Command parsing ────────────────────────────────────────────────────────

const HELP_TEXT = `**Card Tracker Bot — Commands**

\`!add <game> "<product>" "<set>" <region> "<retailer>" <status> [price] [currency] [url]\`
Add a new card entry.

**Arguments:**
• \`game\`: \`pokemon\` or \`one_piece\`
• \`product\`: Product name (in quotes)
• \`set\`: Set/series name (in quotes)
• \`region\`: ${VALID_REGIONS.join(', ')}
• \`retailer\`: Retailer name (in quotes)
• \`status\`: ${VALID_STATUSES.join(', ')}
• \`price\`: (optional) number
• \`currency\`: (optional) e.g. USD, EUR, GBP
• \`url\`: (optional) product link

**Example:**
\`!add pokemon "Prismatic Evolutions ETB" "Scarlet & Violet" US "Pokemon Center" in_stock 54.99 USD https://pokemoncenter.com\`
\`!add one_piece "OP-08 Two Legends Box" "Two Legends" US "TCGPlayer" preorder 119.99 USD\`

\`!update <status> "<product name>"\`
Update the status of an existing entry by product name.

\`!remove "<product name>"\`
Remove an entry by product name.

\`!list [game]\`
List all tracked entries (optionally filtered by game).

\`!help\`
Show this help message.`

function parseAddCommand(content) {
  // !add <game> "<product>" "<set>" <region> "<retailer>" <status> [price] [currency] [url]
  const regex = /^!add\s+(pokemon|one_piece)\s+"([^"]+)"\s+"([^"]+)"\s+(\w+)\s+"([^"]+)"\s+(\w+)(?:\s+(\d+(?:\.\d+)?))?(?:\s+(\w{3}))?(?:\s+(https?:\/\/\S+))?$/i
  const match = content.match(regex)
  if (!match) return null

  const [, game, productName, setOrSeries, region, retailer, status, price, currency, url] = match

  if (!VALID_GAMES.includes(game.toLowerCase())) return null
  if (!VALID_REGIONS.includes(region.toUpperCase())) return null
  if (!VALID_STATUSES.includes(status.toLowerCase())) return null

  const now = nowISO()
  return {
    id: generateId(),
    game: game.toLowerCase(),
    productName,
    setOrSeries,
    releaseDate: today(),
    region: region.toUpperCase(),
    retailer,
    productUrl: url || undefined,
    status: status.toLowerCase(),
    lastChecked: today(),
    price: price ? parseFloat(price) : undefined,
    currency: currency?.toUpperCase() || (price ? 'USD' : undefined),
    notes: undefined,
    createdAt: now,
    updatedAt: now,
  }
}

function parseUpdateCommand(content) {
  // !update <status> "<product name>"
  const regex = /^!update\s+(\w+)\s+"([^"]+)"$/i
  const match = content.match(regex)
  if (!match) return null
  const [, status, productName] = match
  if (!VALID_STATUSES.includes(status.toLowerCase())) return null
  return { status: status.toLowerCase(), productName }
}

function parseRemoveCommand(content) {
  // !remove "<product name>"
  const regex = /^!remove\s+"([^"]+)"$/i
  const match = content.match(regex)
  if (!match) return null
  return { productName: match[1] }
}

function parseListCommand(content) {
  const regex = /^!list(?:\s+(pokemon|one_piece))?$/i
  const match = content.match(regex)
  if (!match) return null
  return { game: match[1]?.toLowerCase() || null }
}

// ─── Bot events ─────────────────────────────────────────────────────────────

client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`)
  console.log(`📡 Listening for card commands in all text channels`)
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  const content = message.content.trim()

  // Help
  if (content === '!help' || content === '!cardhelp') {
    await message.reply(HELP_TEXT)
    return
  }

  // Add command
  if (content.startsWith('!add ')) {
    const entry = parseAddCommand(content)
    if (!entry) {
      await message.reply('❌ Invalid format. Use `!help` to see the correct command format.')
      return
    }

    try {
      const { entries, sha } = await fetchCommunityData()
      entries.push(entry)
      await pushCommunityData(entries, sha)
      await message.reply(
        `✅ Added **${entry.productName}** (${entry.game === 'pokemon' ? '⚡ Pokémon' : '☠️ One Piece'}) — ${entry.status.replace('_', ' ')} at ${entry.retailer} (${entry.region})`
      )
    } catch (err) {
      console.error('Error adding entry:', err)
      await message.reply('❌ Failed to save entry. Check bot logs.')
    }
    return
  }

  // Update command
  if (content.startsWith('!update ')) {
    const update = parseUpdateCommand(content)
    if (!update) {
      await message.reply('❌ Invalid format. Use: `!update <status> "<product name>"`')
      return
    }

    try {
      const { entries, sha } = await fetchCommunityData()
      const idx = entries.findIndex(
        (e) => e.productName.toLowerCase() === update.productName.toLowerCase()
      )
      if (idx === -1) {
        await message.reply(`❌ No entry found matching "${update.productName}"`)
        return
      }
      entries[idx].status = update.status
      entries[idx].lastChecked = today()
      entries[idx].updatedAt = nowISO()
      await pushCommunityData(entries, sha)
      await message.reply(
        `✅ Updated **${entries[idx].productName}** → ${update.status.replace('_', ' ')}`
      )
    } catch (err) {
      console.error('Error updating entry:', err)
      await message.reply('❌ Failed to update entry. Check bot logs.')
    }
    return
  }

  // Remove command
  if (content.startsWith('!remove ')) {
    const remove = parseRemoveCommand(content)
    if (!remove) {
      await message.reply('❌ Invalid format. Use: `!remove "<product name>"`')
      return
    }

    try {
      const { entries, sha } = await fetchCommunityData()
      const idx = entries.findIndex(
        (e) => e.productName.toLowerCase() === remove.productName.toLowerCase()
      )
      if (idx === -1) {
        await message.reply(`❌ No entry found matching "${remove.productName}"`)
        return
      }
      const removed = entries.splice(idx, 1)[0]
      await pushCommunityData(entries, sha)
      await message.reply(`✅ Removed **${removed.productName}**`)
    } catch (err) {
      console.error('Error removing entry:', err)
      await message.reply('❌ Failed to remove entry. Check bot logs.')
    }
    return
  }

  // List command
  if (content.startsWith('!list')) {
    const list = parseListCommand(content)
    if (!list && content !== '!list') return

    try {
      const { entries } = await fetchCommunityData()
      let filtered = entries
      if (list?.game) {
        filtered = entries.filter((e) => e.game === list.game)
      }

      if (filtered.length === 0) {
        await message.reply('📭 No community entries found.')
        return
      }

      const lines = filtered.slice(0, 20).map((e, i) => {
        const gameIcon = e.game === 'pokemon' ? '⚡' : '☠️'
        const statusText = e.status.replace('_', ' ')
        const priceText = e.price ? ` — ${e.currency || ''} ${e.price}` : ''
        return `${i + 1}. ${gameIcon} **${e.productName}** | ${e.region} | ${e.retailer} | ${statusText}${priceText}`
      })

      const header = `📋 **Community Entries** (${filtered.length} total${list?.game ? `, ${list.game}` : ''}):\n`
      const footer = filtered.length > 20 ? `\n_...and ${filtered.length - 20} more_` : ''
      await message.reply(header + lines.join('\n') + footer)
    } catch (err) {
      console.error('Error listing entries:', err)
      await message.reply('❌ Failed to fetch entries. Check bot logs.')
    }
    return
  }
})

client.login(DISCORD_BOT_TOKEN)
