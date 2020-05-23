const { Collection } = require('discord.js');

class CommandStore extends Collection {
  fetch(str) {
    return this.find((c) => c.name.toLowerCase() === str.toLowerCase() || 
    	c.aliases.includes(str.toLowerCase()));
  }
}

class SongStore extends Collection {
  fetch(str) {
    return this.find((c) => c.name.toLowerCase() === str.toLowerCase() || 
    	c.aliases.includes(str.toLowerCase()));
  }
}

class QueueStore extends Collection {
  fetch(str) {
    return this.find((c) => c.name.toLowerCase() === str.toLowerCase() || 
    	c.aliases.includes(str.toLowerCase()));
  }
}

module.exports = { SongStore, CommandStore, QueueStore };