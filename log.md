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