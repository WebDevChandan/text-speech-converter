const textField = document.querySelector('textarea'),
spchBtn = document.querySelector('input'),
select = document.querySelector('select');

let synth = speechSynthesis;    //"Controller Interface" for the Speech Service.
let isSpeaking = true;


function voices(){
    // .getVoices() method of speechSynthesis returns a list of voice Object of the user Current Device.
    for (let voice of synth.getVoices()) {
        // Selecting "Google US English" as Default/Selected.
        let selected = voice.name === "Google US English" ? "selected" : "";
        // Creating an Option Tag with Passing Voice Name and Voice Language
        let options = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang}) </option>`;
        // Inserting All generated Option Tags as per Voice Object beforeend of Select Element.
        select.insertAdjacentHTML('beforeend', options);
      
    }
    
}
voices();
synth.addEventListener("voiceschanged", voices);    //Calling voices function from here
// The voiceschanged event of the Web Speech API is fired when the list of SpeechSynthesisVoice objects that would be returned by the SpeechSynthesis.getVoices() method has changed (when the voiceschanged event fires.)

const textToSpeech = (text) => {
    
    // Action/Sending Request of Saying text to the class "SpeechSynthesisUtterance": This class's meaning is, Action of Saying(utterance) by combining(Synthesis) user's text  it to Speech.
    //Creating Object(as utterance) of SpeechSynthesisUtterance Constructor (which represent a speech request).
    let utterance = new SpeechSynthesisUtterance(text);   
    for (let voice of synth.getVoices()) {
        if (select.value === voice.name) {
            //If the Selected Voice is === Available Device Voice.name, then set that voice (as Object) to the voice property of utterance object.
            utterance.voice= voice;
        }
    }    
    // console.log(utterance.voice);
    synth.speak(utterance);     //Speak the Speech/Utterance
    
}

spchBtn.addEventListener('click', e => {
    //Preventing form to submit
    e.preventDefault();

    if (textField.value !== ""&& e.target.value=="Convert To Speech") {
        if (!synth.speaking) {
            //While Speaking synth.speaking: false. So, it'll not call AgainAndAgain/Repeat while speaking
            textToSpeech(textField.value);
        }
        if (textField.value.length > 80) {
            /*Initially, On clicking spchBtn, firstly, it prevent to submit the form by executing "e.preventDefault();" then, As textField.value is not empty, And !synth.speaking:true (i.e.Not Speaking) then it, will execute  "textToSpeech(textField.value);".

            Afterthat, By checking (textField.value.length>80) and isSpeaking:true, it will execute the following statments: "synth.resume(); (At First Click, it's Action will not noticible)
                                      isSpeaking = false; (Set to false, to run elseBlock next time)
                                      spchBtn.value = "Pause Speech"; "(Change Button's Text to From  "Convert To Speech" to "Pause Speech" )
            */
            if (isSpeaking) {
                
                synth.resume();
                isSpeaking = false;
                spchBtn.value = "Pause Speech";
                
            } else {
                synth.pause();
                isSpeaking = true;
                spchBtn.value = "Resume Speech";
                
            }

            //Checking is utterance/Speech is speaking process or not in every 100ms
            //if not then set the value of isSpeaking to true and change the button text
            //Here, setInterval() method works as an event which trigger its statments on whole document in every 100ms without refreshing the page.
            setInterval(() => {
                if (!synth.speaking & !isSpeaking) {
                    isSpeaking = true;
                 //As Speech End, change spchBtn's text from 'Pause Speech' to 'Convert to Speech'.
                    spchBtn.value = "Convert To Speech";   
                }
            },100);
            
        } else {
            spchBtn.value = "Convert To Speech";
        }

    } else {
        for (let voice of synth.getVoices()) { 
            if (select.value === voice.name) { 
                record(voice.lang);
            }
        }
        
    }
});


//Speech To Text Convert
let swtch = document.querySelector('#switcher');

swtch.addEventListener('click', () => { 
    let icn1 = document.querySelector('#switcher>i.fa-volume-high'),
        icn2 = document.querySelector('#switcher>i.fa-microphone');
    if (swtch) {
        icn1.style.backgroundColor = "transparent";
        icn1.style.color = "#000";
        icn2.style.backgroundColor = "var(--swt-icn-bg)";
        icn2.style.color = "var(--swt-icn-clr)";
        document.querySelector('h1').innerHTML = "Speech To Text";
        document.querySelector('#txt_Display').innerHTML = "Text Display";
        document.querySelector('.slt_lng').innerHTML = "Select Language";
        spchBtn.value = "Convert To Text";
        spchBtn.style.backgroundColor = "#00C896";
        textField.value = "";
        textField.disabled = true;
        textField.style.color="#3f3e3e";
        textField.style.borderColor="#94919152";;
        swtch = false;
    } else {
        icn2.style.backgroundColor = "transparent";
        icn2.style.color = "#000";
        icn1.style.backgroundColor = "var(--swt-icn-bg)";
        icn1.style.color = "var(--swt-icn-clr)";
        document.querySelector('h1').innerHTML = "Text To Speech";
        document.querySelector('#txt_Display').innerHTML = "Enter Text";
        document.querySelector('.slt_lng').innerHTML = "Select Voice";
        spchBtn.value = "Convert To Speech";
        spchBtn.style.backgroundColor = "var(--ascent)";
        textField.value = "";
        textField.disabled = false;
        swtch = true;
    }
});



function record(lang) {
   
    var recognition = new webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.onresult = function (event) {
        let getVoice= event.results[0][0].transcript;
        textField.value = getVoice;
    }
    recognition.start();
}