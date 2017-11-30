# started, ran initial test with Apache bench

ab -n 1000000 -c10 -T application/json -k -p data.json http://localhost:3000/api/usages

Concurrency Level:      10
Time taken for tests:   161.053 seconds
Complete requests:      1000000
Failed requests:        0
Requests per second:    6209.14 [#/sec] (mean)
Time per request:       1.611 [ms] (mean)
Time per request:       0.161 [ms] (mean, across all concurrent requests)


# Next step, remove obvious performance problems...likely minor upgrade.
# Remove dev logging level, remove console log from usages, remove call to length on usages array (redunant since push returns the length)

# More improvement than I imagined:

ab -n 1000000 -c10 -T application/json -k -p data.json http://localhost:3000/api/usages

Concurrency Level:      10
Time taken for tests:   107.003 seconds
Complete requests:      1000000
Failed requests:        0
Requests per second:    9345.54 [#/sec] (mean)
Time per request:       1.070 [ms] (mean)
Time per request:       0.107 [ms] (mean, across all concurrent requests)

# Bottlenecks that I think are preventing this from running faster:
# 1) the global array (usages). I *think* direct assignment would be faster than using push but that seems like a minor enhancement.  Skip this for now.

# 2) Serial processing of the requests vs some sort of parallel processing.  Looking into this a bit more (being somewhat unfamiliar with Node as middleware), I see you can easily create a cluster.  Let's do that.

# Add in a new startup script (cluster-server) that creates a worker for each core available in my laptop (8 total).

ab -n 1000000 -c10 -T application/json -k -p data.json http://localhost:3000/api/usages

Concurrency Level:      10
Time taken for tests:   44.691 seconds
Complete requests:      1000000
Failed requests:        0
Requests per second:    22375.93 [#/sec] (mean)
Time per request:       0.447 [ms] (mean)
Time per request:       0.045 [ms] (mean, across all concurrent requests)

#Better.  But wait.  Each worker is essentially running a new instance of the app, meaning we have 8 distinct Usages arrays going.  That's not good.  We'll need some sort of store for the data.  I usually prefer sql but that seems 1) overkill for this and 2) slow compared to a key/value store like Redis.  3) Redis is really easy to get running/integrated.

# Install redis (brew install redis)
# Launch redis... ping to make sure it's running
# Add redis-npm to package.json
# Npm install
# Create client and add to app scope.  Since there's one redis server running it doesn't really matter that we have 8 clients talking to it, versus the 8 distinct arrays we had prior.
# Write to redis client within api...

# Run test again.  very close; slower than with the array though
ab -n 1000000 -c10 -T application/json -k -p data.json http://localhost:3000/api/usages

Concurrency Level:      10
Time taken for tests:   71.994 seconds
Complete requests:      1000000
Failed requests:        0
Requests per second:    13890.06 [#/sec] (mean)
Time per request:       0.720 [ms] (mean)
Time per request:       0.072 [ms] (mean, across all concurrent requests)

# increasing the concurrency on apache bench from 10 to 50 allows us to complete 1M requests in under 60 seconds.  :)

ab -n 1000000 -c50 -T application/json -k -p data.json http://localhost:3000/api/usages

Concurrency Level:      50
Time taken for tests:   51.125 seconds
Complete requests:      1000000
Failed requests:        0
Requests per second:    19559.83 [#/sec] (mean)
Time per request:       2.556 [ms] (mean)
Time per request:       0.051 [ms] (mean, across all concurrent requests)

# Validate that data is indeed stored in redis u sing redis-cli
# Count keys: dbcount (should equal 2000000 at this point)
# Spot check some keys (hmget 101 medication timestamp, hmget 1234 medication timestamp).  All spot checks return:
1) "Albuterol"
2) "Tue Nov 01 2016 09:11:51 GMT-0500 (CDT)"

