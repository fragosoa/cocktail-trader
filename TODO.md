# TODO
- [ ] Debezium integration to listen Order changes
- [ ] Integrate a Redis instance to be updated every 5 minutes from periodic aggrecations from PriceHistory table. Drinks table will be updated from Redis instance.
    - [ ] Use AppScheduler to trigger a job to update Redis
    - [ ] Extend Drinks to include Open, Close, High, Low prices.
- [ ] For Admin Frontend: 
    - [ ] Create a Debezium instance that listens changes in Orders and OrderItems table. It should refresh with the latest orders in realtime.
    - [ ] Every time an item is fulfilled, change the status in the UI. 
    - [ ] Once all items in an Order are completed, the order must be closed.
    - [ ] Capture realtime events from UI using sockets.
