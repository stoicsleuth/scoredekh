const rp = require('request-promise');
const $ = require('cheerio');
const notifier = require('node-notifier');
const path = require('path');
const opn = require('opn');
const url = 'https://demo.entitysport.com/';


function start(){

let scores=[];
let match, current_score;
let title ='', current_ball ='', score_current='', last_ball_commentary, status;
let prev_status='0', current_status;


rp(url)
  .then(function(html){
    //success!
    match = $('.match-status-3.match-format-6', html)[0].attribs.href;
    console.log((match));
    let refresh = setInterval(()=>{
        rp(match)
        .then(html=>{
            title = $('#heading', html).text();
            current_ball = $('.live-info4 > span:nth-child(1)', html).text();
            score_current = $('.ovb').text();
            console.log(title, current_ball, prev_status);
            status = $('status_note'. html).text();

            current_score= $('.teamScore', html).first().text();

            if(current_score.includes('*')==false){
                    current_score= $('.teamScore', html).last().text();
            }
            console.log(current_score);

            if(current_ball!=prev_status){
                console.log("Off");
                
                console.log("Off");
                current_ball_commentary= $('.comment-ball .text', html).first().text();
                console.log(current_ball_commentary);

                if(status.includes('won')){
                    
                    notifier.notify({
                        title: "Match Over!",
                        subtitle: current_score, 
                        message: status,
                        sound: 'glass',
                        //icon : path.join(__dirname, 'ipl.jpg'),
                        contentImage: path.join(__dirname, 'ipl.jpg'),
                        timeout: 7
                    });
                    clearInterval(refresh);
                }
                else{



                
                    if(current_ball=="W"){
                        current_ball_commentary= $('.comment-wicket .text', html).text();
                        notifier.notify({
                            title: current_ball,
                            subtitle: current_score, 
                            message: current_ball_commentary,
                            sound: 'glass',
                            //icon : path.join(__dirname, 'ipl.jpg'),
                            contentImage: path.join(__dirname, 'ipl.jpg'),
                            timeout: 5
                        });
                        console.log("Wicket!"+" "+ current_ball_commentary);
                    }
                    if(current_ball=="4" || current_ball =="6"){
                        current_ball_commentary= $('.comment-ball .text', html).text();
                        notifier.notify({
                            title: current_ball,
                            subtitle: current_score, 
                            message: current_ball_commentary,
                            sound: 'glass',
                            //icon : path.join(__dirname, 'ipl.jpg'),
                            contentImage: path.join(__dirname, 'ipl.jpg'),
                            timeout: 5
                        });
                        console.log(current_ball_commentary);
                    }
                    if(current_ball =="6"){
                       
                        opn('http://swiggy.com');
                        
                    }
                    prev_status = current_ball;
                }


            }
            
    
        })
        .catch(err=>{
            console.log(err);
        });
    }, 3000);
  })
  .catch(function(err){
    //handle error
});



}