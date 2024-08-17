class HyperswarmStats {
  constructor (swarm) {
    this.swarm = swarm
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
  }
}

module.exports = HyperswarmStats
