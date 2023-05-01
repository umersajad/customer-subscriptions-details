# Basic Setup Guide

- npm i
- add your stripe `STRIPE_PUBLISHABLE_KEY` && `STRIPE_SECRET_KEY` in .env
- npm start

## GET: localhost:[PORT:8000]/get_subscriptions

response:

```
 {
    "data": [
        {
            "multipleProductIdsAgainstSameSubscription": {
                "status": false,
                "product_ids": []
            },
            "subscription_length": 1,
            "customer_details": {
                "customer_id": "cus_NhIfhgsa****",
                "customer_email": "john@example.com",
                "customer_name": "John Doe"
            },
            "subscriptions": [
                {
                    "subscription_details": {
                        "subscription_id": "sub_1MvuBZF2zGZ7yHRLBv****",
                        "subscription_status": "active",
                        "time_stamps": {
                            "subscription_created_at": "12 Apr 2023 8:17:29",
                            "subscription_period_end": "12 May 2023 8:17:29",
                            "subscription_period_start": "12 Apr 2023 8:17:29"
                        }
                    },
                    "products_details": {
                        "product_id": "daeae4a6-643b-4e91-9ec0-******",
                        "product_amount": 8328,
                        "metadata": {
                            "monthliesFee": "127.62",
                            "monthliesFeeGST": "12.76",
                            "occupations": "7374",
                            "partnerId": "upcover",
                            "policyNumber": "HP-010666-****",
                            "products": "healthcare-professionals",
                            "quoteId": "92d26067-68e8-4b9b-9ee6-c****",
                            "totalPayable": "1076.28",
                            "userId": "email|6421714aa5f504******",
                            "vendorName": "probind"
                        }
                    }
                }
                .
                .
                .
            ]
        },
    ],
    "total_customers": 10,
 }

```
