const axios = require('axios');
const Consul = require('consul');

const consul = new Consul({ host: 'localhost', port: 8500 });

var customerMicroservice = {}, port, host;

const customerWatcher = consul.watch({
  method: consul.health.service,
  options: {
    service: 'CustomerMS',
    passing:true
  }
})

customerWatcher.on('change', (data) => {
  customerMicroservice = data[0].Service;
  host = customerMicroservice.Address;
  port = customerMicroservice.Port;
})


// Function to check if customer exists
exports.isValidCustomer = async (customerId) => {
  try {
    console.log("Validating customer:", customerId);
    const checkCustomer = await axios.get(`http://${host}:${port}/customer/${customerId}`);
    return checkCustomer ? true : false;
  } catch (error) {
    console.error("Error validating customer:", error);
    return false;
  }
};

