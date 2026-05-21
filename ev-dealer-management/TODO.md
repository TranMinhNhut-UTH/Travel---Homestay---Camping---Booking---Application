# VehicleForm Modernization Plan

## Current Issues
- Mixed color scheme across sections (green, orange, purple, red, cyan)
- Grid sizing issues (xs=40 should be xs=12)
- Inconsistent spacing and layout

## Changes Needed
- [ ] Update Model section: Change from green (#4caf50) to light blue theme
- [ ] Update Year section: Change from orange (#ff9800) to medium blue theme
- [ ] Update Price section: Change from purple (#9c27b0) to darker blue theme
- [ ] Update Status section: Change from red (#f44336) to blue theme
- [ ] Update Description section: Change from cyan (#00bcd4) to blue theme
- [ ] Update Image section: Change from purple (#673ab7) to blue theme
- [ ] Fix Grid layout: Change xs=40 to xs=12 for proper responsive design
- [ ] Ensure consistent blue color variations for visual hierarchy

## Testing
- [ ] Visual check of all sections with new blue theme
- [ ] Test responsive layout on different screen sizes
- [ ] Verify all form functionality remains intact

---

# Microservices Integration TODO

## VehicleService RabbitMQ Integration
- [x] Add RabbitMQ.Client package to VehicleService.csproj
- [x] Create IMessageProducer interface in Services folder
- [x] Create RabbitMQProducerService implementation
- [x] Add RabbitMQ configuration to appsettings.json
- [x] Add RabbitMQ configuration to appsettings.Development.json
- [x] Register RabbitMQ service in Program.cs
- [x] Create event DTOs for vehicle events (VehicleCreatedEvent, VehicleUpdatedEvent, VehicleDeletedEvent)
- [x] Modify VehicleService to publish events on create/update/delete operations
- [x] Add health check endpoint for API Gateway compatibility
- [x] Update Dockerfile with health checks
- [x] Update docker-compose.yml with RabbitMQ environment variables and dependencies

## Next Steps
- [ ] Add RabbitMQ integration to other services (CustomerService, SalesService, etc.)
- [ ] Implement event consumers in NotificationService for vehicle events
- [ ] Add API Gateway configuration for routing and health checks
- [ ] Add NiFi integration for data export endpoints
- [ ] Add logging and monitoring capabilities
- [ ] Test full microservices integration
