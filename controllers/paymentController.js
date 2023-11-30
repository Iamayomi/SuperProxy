const stripe = require('stripe')('sk_test_51OFRCGL7aSXa1KxAZV7ugjhrnT1mYceUoy1oyIPoUcRG54Ah2wmPYyX9KPS0mEnOgIKuaZLa2jCOMbOFrwJMn4Od00iU4BlII3');
const Job = require('../models/jobModel');
const errorAsync = require('../utils/errorAsync');
const AppError = require('../utils/appError');


exports.paymentSession = errorAsync(async function(req, res, next) {
    const job = await Job.findById(req.params.jobId);
    console.log(job.jobName);
    
    const product = await stripe.products.create({
          name: job.jobName,
          description: `payment for ${job.jobCategories}`,
    });
    
    const price = await stripe.prices.create({
          product: product.id,
          unit_amount: job.price * 100,
          currency: 'usd',
    });
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/SuperProxy/login`,
        cancel_url: `${req.protocol}://${req.get('host')}/SuperProxy/user/login`,
        customer_email: req.user.email,
        client_reference_id: req.params.jobId,
        mode: 'payment',
        line_items: [{
            price: price.id,
            quantity: 1,
        }]
    });
    
    
    res.status(200).json({
        status: "Success",
        session
    });
});

exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
	
	let event;
	try {
	    event = stripe.webhooks.constructEvent(req.body, signature);
	} catch(err){
		return next(res.status(400).send(`webhook error: ${err.message}`));
	};
	
	
	if(event.type === 'checkout.session.complete')
	
	res.status(200).json({ received: true });
};

