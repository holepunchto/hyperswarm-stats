class HyperswarmStats {
  constructor (swarm) {
    this.swarm = swarm

    this._bytesTransmittedOverClosedSwarmStreams = 0
    this._packetsTransmittedOverClosedSwarmStreams = 0
    this._bytesReceivedOverClosedSwarmStreams = 0
    this._packetsReceivedOverClosedSwarmStreams = 0
    swarm.on('connection', conn => {
      conn.on('close', () => {
        this._bytesTransmittedOverClosedSwarmStreams += conn.rawStream?.bytesTransmitted || 0
        this._packetsTransmittedOverClosedSwarmStreams += conn.rawStream?.packetsTransmitted || 0
        this._bytesReceivedOverClosedSwarmStreams += conn.rawStream?.bytesReceived || 0
        this._packetsReceivedOverClosedSwarmStreams += conn.rawStream?.packetsReceived || 0
      })
    })
  }

  get connects () {
    return this.swarm.stats.connects
  }

  get updates () {
    return this.swarm.stats.updates
  }

  get punches () {
    return this.swarm.dht.stats.punches
  }

  get dhtQueries () {
    return this.swarm.dht.stats.queries
  }

  getBytesTransmittedAcrossAllStreams () {
    let bytesFromCurrentConns = 0
    for (const conn of this.swarm.connections) {
      bytesFromCurrentConns += conn.rawStream?.bytesTransmitted || 0
    }

    return bytesFromCurrentConns + this._bytesTransmittedOverClosedSwarmStreams
  }

  getBytesReceivedAcrossAllStreams () {
    let bytesFromCurrentConns = 0
    for (const conn of this.swarm.connections) {
      bytesFromCurrentConns += conn.rawStream?.bytesReceived || 0
    }

    return bytesFromCurrentConns + this._bytesReceivedOverClosedSwarmStreams
  }

  getPacketsTransmittedAcrossAllStreams () {
    let packetsFromCurrentConns = 0
    for (const conn of this.swarm.connections) {
      packetsFromCurrentConns += conn.rawStream?.packetsTransmitted || 0
    }

    return packetsFromCurrentConns + this._packetsTransmittedOverClosedSwarmStreams
  }

  getPacketsReceivedAcrossAllStreams () {
    let packetsFromCurrentConns = 0
    for (const conn of this.swarm.connections) {
      packetsFromCurrentConns += conn.rawStream?.packetsReceived || 0
    }

    return packetsFromCurrentConns + this._packetsReceivedOverClosedSwarmStreams
  }

  get dhtClientSocketBytesTransmitted () {
    return this.swarm.dht.io.clientSocket?.bytesTransmitted || 0
  }

  get dhtClientSocketPacketsTransmitted () {
    return this.swarm.dht.io.clientSocket?.packetsTransmitted || 0
  }

  get dhtClientSocketBytesReceived () {
    return this.swarm.dht.io.clientSocket?.bytesReceived || 0
  }

  get dhtClientSocketPacketsReceived () {
    return this.swarm.dht.io.clientSocket?.packetsReceived || 0
  }

  get dhtServerSocketBytesTransmitted () {
    return this.swarm.dht.io.serverSocket?.bytesTransmitted || 0
  }

  get dhtServerSocketPacketsTransmitted () {
    return this.swarm.dht.io.serverSocket?.packetsTransmitted || 0
  }

  get dhtServerSocketBytesReceived () {
    return this.swarm.dht.io.serverSocket?.bytesReceived || 0
  }

  get dhtServerSocketPacketsReceived () {
    return this.swarm.dht.io.serverSocket?.packetsReceived || 0
  }

  get udxBytesTransmitted () {
    return this.swarm.dht.udx.bytesTransmitted
  }

  get udxPacketsTransmitted () {
    return this.swarm.dht.udx.packetsTransmitted
  }

  get udxBytesReceived () {
    return this.swarm.dht.udx.bytesReceived
  }

  get udxPacketsReceived () {
    return this.swarm.dht.udx.packetsReceived
  }

  // TODO
  // get nrDhtEntries () {}

  get nrPeers () {
    return this.swarm.peers.size
  }

  registerPrometheusMetrics (promClient) {
    const self = this
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_nr_peers',
      help: 'Number of peers this swarm is connected to',
      collect () {
        this.set(self.nrPeers)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_client_connections_opened',
      help: 'Total number of client connections opened by the swarm',
      collect () {
        this.set(self.connects.client.opened)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_client_connections_closed',
      help: 'Total number of client connections closed by the swarm',
      collect () {
        this.set(self.connects.client.closed)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_client_connections_attempted',
      help: 'Total number of client connections attempted by the swarm',
      collect () {
        this.set(self.connects.client.attempted)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_server_connections_opened',
      help: 'Total number of server connections opened by the swarm',
      collect () {
        this.set(self.connects.server.opened)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_server_connections_closed',
      help: 'Total number of server connections closed by the swarm',
      collect () {
        this.set(self.connects.server.closed)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_consistent_punches',
      help: 'Total number of consistent holepunches performed by the hyperdht instance',
      collect () {
        this.set(self.punches.consistent)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_random_punches',
      help: 'Total number of random holepunches performed by the hyperdht instance',
      collect () {
        this.set(self.punches.random)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_open_punches',
      help: 'Total number of open holepunches performed by the hyperdht instance',
      collect () {
        this.set(self.punches.open)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_active_queries',
      help: 'Number of currently active queries in the dht-rpc instance',
      collect () {
        this.set(self.dhtQueries.active)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_total_queries',
      help: 'Total number of queries in the dht-rpc instance',
      collect () {
        this.set(self.dhtQueries.total)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_bytes_transmitted',
      help: 'todo',
      collect () {
        this.set(self.udxBytesTransmitted)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_packets_transmitted',
      help: 'todo',
      collect () {
        this.set(self.udxPacketsTransmitted)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_bytes_received',
      help: 'todo',
      collect () {
        this.set(self.udxBytesReceived)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_packets_received',
      help: 'todo',
      collect () {
        this.set(self.udxPacketsReceived)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_client_socket_bytes_transmitted',
      help: 'todo',
      collect () {
        this.set(self.dhtClientSocketBytesTransmitted)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_client_socket_packets_transmitted',
      help: 'todo',
      collect () {
        this.set(self.dhtClientSocketPacketsTransmitted)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_client_socket_bytes_received',
      help: 'todo',
      collect () {
        this.set(self.dhtClientSocketBytesReceived)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_client_socket_packets_received',
      help: 'todo',
      collect () {
        this.set(self.dhtClientSocketPacketsReceived)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_server_socket_bytes_transmitted',
      help: 'todo',
      collect () {
        this.set(self.dhtServerSocketBytesTransmitted)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_server_socket_packets_transmitted',
      help: 'todo',
      collect () {
        this.set(self.dhtClientSocketPacketsTransmitted)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_server_socket_bytes_received',
      help: 'todo',
      collect () {
        this.set(self.dhtServerSocketBytesReceived)
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'dht_server_socket_packets_received',
      help: 'todo',
      collect () {
        this.set(self.dhtServerSocketPacketsReceived)
      }
    })

    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_bytes_transmitted_over_swarm_streams',
      help: 'todo',
      collect () {
        this.set(self.getBytesTransmittedAcrossAllStreams())
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_bytes_received_over_swarm_streams',
      help: 'todo',
      collect () {
        this.set(self.getBytesReceivedAcrossAllStreams())
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_packets_transmitted_over_swarm_streams',
      help: 'todo',
      collect () {
        this.set(self.getPacketsTransmittedAcrossAllStreams())
      }
    })
    new promClient.Gauge({ // eslint-disable-line no-new
      name: 'hyperswarm_total_packets_received_over_swarm_streams',
      help: 'todo',
      collect () {
        this.set(self.getPacketsReceivedAcrossAllStreams())
      }
    })
  }
}

module.exports = HyperswarmStats
