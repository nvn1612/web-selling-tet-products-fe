import { orderConstants } from "./constants";

export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}


 export const getBase64 = (file)=>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

export const renderOptions = (arr) => {
    let results = []
    if(arr) {
        results = arr?.map((opt) =>{
            return {
                value: opt,
                label: opt
            }
        })
    }
    results.push({
        label: 'Thêm type',
        value: 'add_type'
    })
    return results
}
export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replace(',','.')
        return `${result} VND`
    } catch (error) {
        return null
    }
}

export const initFacebookSDK = () => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  
    let locale = "vi_VN";
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FB_ID, // Your App ID
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse social plugins on this page
        version: "v8.6", // use the correct SDK version
      });
    };
  
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `https://connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };
  

  export const convertDataChart = (data, type) => {
    try {
      const object = {}
      Array.isArray(data) && data.forEach((opt) => {
        if(!object[opt[type]]) {
          object[opt[type]] = 1
        } else {
          object[opt[type]] ++
        }
      })
      const results = Array.isArray(Object.keys(object)) && Object.keys(object).map((item) => {
        return {
          name:  orderConstants.payment[item],
          value: object[item]
        }
      })
       return results
    } catch (e) {
      return []
    }
  }