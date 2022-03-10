const axios = require("axios");
const randomUser = require("./randomUser");

//Response chacker
const checkResponse = (response) => {
  const code = response.error?.code || "";
  const declineCode = response.error?.decline_code;
  const message = response.error?.message;
  
  if(code == "incorrect_cvc" || declineCode == "incorrect_cvc"){
    return({isLive: true, type: "CCN", code,  message});
  };
  if(code == "insufficient_funds" || declineCode == "insufficient_funds"){
    return({isLive: true, type: "CCN", code, message});
  };
  if(code == "lost_card" || declineCode == "lost_card"){
    return({isLive: false, type: "DEAD", code,  message});
  };
  if(code == "stolen_card" || declineCode == "stolen_card"){
    return({isLive: false, type: "DEAD", code,  message});
  };
  if(code == "testmode_charges_only" || declineCode == "testmode_charges_only"){
    return({isLive: false, type: "DEAD", code, message});
  };
  if(message.includes("Sending credit card numbers directly to the Stripe API")){
    return({isLive: false, type: "DEAD", code,  message: "SK Error: Integration"});
  };
  if(message.includes("You must verify a phone number")){
    return({isLive: false, type: "DEAD", code,  message: "SK Error: Verify Phone Number"});
  };
  
  return({isLive: false, type: "DEAD", code, message});
};

/*First Request*/
const customers = async (SK, user) => {
  try {
    const fields = `email=${user.email}&description=Tikol4Life&address[line1]=${user.street}&address[city]=${user.city}&address[state]=${user.state}&address[postal_code]=${user.postcode}&address[country]=US`;
    
    const response = await axios({
      method: 'POST',
      url: 'https://api.stripe.com/v1/customers',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "authorization": `Bearer ${SK}`
      },
      data: encodeURIComponent(fields)
    });
    
    return [true, response.data];
  } catch (e) {
    return [false, e.response.data];
  }
};

/*Second Request*/
const setup = async (SK, cid, card) => {
  try {
    const fields = `payment_method_data[type]=card&customer=${cid}&payment_method_data[card][number]=${card[0]}&payment_method_data[card][exp_month]=${card[1]}&payment_method_data[card][exp_year]=${card[2]}&payment_method_data[card][cvc]=${card[3]}&usage=off_session`;
    
    const response = await axios({
      method: 'POST',
      url: 'https://api.stripe.com/v1/setup_intents',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "authorization": `Bearer ${SK}`
      },
      data: fields
    });
    return [true, response.data]
  } catch (e) {
    return [false, e.response.data];
  }
}

/*Third request*/
const attach = async (SK, pm, cid) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.stripe.com/v1/payment_methods/${pm}/attach`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "authorization": `Bearer ${SK}`
      },
      data: `customer=${cid}`
    });
    return [true, response.data];
  } catch (e) {
    return [false, e.response.data];
  }
};

/*Main function*/
const main = async (SK, card) => {
  try {
    /*Get random User*/
    const user = await randomUser();
    /*Get the customers id*/
    const res1 = await customers(SK, user);
    const cid = res1[1]?.id;
    /*Validate the first request*/
    if (!res1[0]) {
      return({isLive: false, type: "DEAD", code: '',  message: "Somethong wrong or Invalid Stripe Key"});
      return; 
    };
    
    /*Validate Second request*/
    const res2 = await setup(SK, cid, card);
    if (!res2[0]) {
      return(checkResponse(res2[1]));
    } else {
      /*Third request*/
      const pm = res2[1].payment_method;
      const res3 = await attach(SK, pm, cid);
      if (!res3[0]) {
        return(checkResponse(res3[1]));
      } else {
        const cvcRes = res3[1].card.checks.cvc_check || null;
        
        if(cvcRes == "pass" || cvcRes == "success") {
          return({isLive: true, type: "CVV", code: "", message: cvcRes});
        } else {
          return({isLive: false, type: "DEAD", code: "", message: cvcRes});
        };
      };
    };
  } catch (e) {
    return main(SK, card);
  }
};

module.exports = main;