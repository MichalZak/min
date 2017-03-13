

export function getConfig(){
 //local   
 /*
    return {
       database_properties: "http://localhost:5984/min_prop" ,
       web_url: "http://localhost:3010"
    }
*/
 //remote  
  return {
       WebUrl: "http://min.mzlabs.net",
       database_name: "min.mzlabs.net/min",
       database_properties: "https://couch.mzlabs.net/min_prop" 
    }

}

