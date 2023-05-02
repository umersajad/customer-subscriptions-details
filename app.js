const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middlewares here
app.use(express.json());
app.use(cors());

// End-point for get all customers having multiple active subscriptions
app.get("/get_subscriptions", async (req, res) => {
  let subscriptions = [];
  let customers = {};
  let productNamesAgainstSubscriptions = {};

  for await (const subscription of stripe.subscriptions.list({
    expand: ["data.customer", "data.plan.product"],
    limit: 100,
  })) {
    subscriptions.push(subscription);
  }

  if (subscriptions.length > 1) {
    subscriptions.filter((subscription) => {
      if (subscription.status == "active") {
        let subData = {
          subscription_details: {
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            time_stamps: {
              subscription_created_at: timeConverter(subscription.created),
              subscription_period_start: timeConverter(
                subscription.current_period_start
              ),
              subscription_period_end: timeConverter(
                subscription.current_period_end
              ),
            },
          },
          products_details: {
            product_id: subscription.plan.product.id,
            product_name: subscription.plan.product.name,
            product_amount: subscription.plan.amount,
            metadata: subscription.metadata ?? {},
          },
        };

        if (customers[subscription.customer.id]) {
          productNamesAgainstSubscriptions[subscription.customer.id].push(
            subscription.plan.product.name
          );
          customers[subscription.customer.id].subscriptions.push(subData);
          customers[subscription.customer.id].subscription_length =
            customers[subscription.customer.id].subscriptions.length;
        } else {
          productNamesAgainstSubscriptions[subscription.customer.id] = [
            subscription.plan.product.name,
          ];
          customers[subscription.customer.id] = {
            subscription_length: 1,
            customer_details: {
              customer_id: subscription.customer.id,
              customer_email: subscription.customer.email,
              customer_name: subscription.customer.name,
            },
            subscriptions: [subData],
          };
        }
      }
    });

    let response = Object.values(customers).map((res) => ({
      multipleProductNamesAgainstSameSubscription: getMultiple(
        productNamesAgainstSubscriptions[res.customer_details.customer_id]
      ),
      ...res,
    }));
    return res.json({
      data: response,
      total_customers: customers.length,
    });
  }
  return res.json({ data: [], total_customers: 0 });
});

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}
function getMultiple(arr) {
  let multiples = arr.filter((item, index) => {
    return arr.indexOf(item) === index && arr.lastIndexOf(item) !== index;
  });
  return {
    status: multiples.length > 0,
    product_names: multiples,
  };
}

// Listen
app.listen(8000, () => {
  console.log("Server started at port 8000");
});
