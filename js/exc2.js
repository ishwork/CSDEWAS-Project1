//Calling function for event handling
document.getElementById('invoice').oninput=f_color;
document.getElementById('decode').onclick=f_slice;


//function to set background color of text field to grey while entering value
function f_color() {
    if (document.getElementById('invoice').value !== ''){
        document.getElementById('invoice').style.background = "grey";
    }

}


//function to set collect information from virtual bar code
function f_slice() {
    var user_input = document.getElementById('invoice').value;
    //Checking if the user input starts with "4" or "5" and the length of user input is exactly 54
    if (((/^(4|5)/g).test(user_input) === true) && (user_input.length === 54)){
        //Using slicing method to extract information from virtual code
        var iban= user_input.slice(1,17);
        var reference1=user_input.slice(25,28);
        var reference2=user_input.slice(28,48);
        var amount_in_euros=user_input.slice(17,23);
        var amount_in_cents=user_input.slice(23,25);
        var date_year=user_input.slice(48,50);
        var date_month=user_input.slice(50,52);
        var date_day=user_input.slice(52,54);

        var reference;
        //Removing leading zeros from the string
        var result2 = reference2.replace(/^(0+)/g, '');

        //Testing if all the string are zero using if condition
        if ((/^0*$/g).test(reference1) === true){
            reference = result2; //To get reference for version 4
        }
        else{
            var result1 = reference1.slice(0,2);
            reference = "RF" + result1 + result2; //To get reference for version 5
        }


        //Parsing the integer(i.e. removing leading zeros) and making counting numbers easy
        amount_in_euros = parseInt(amount_in_euros,10).toLocaleString();
        var amount= amount_in_euros + "." + amount_in_cents;

        //Formatting the date as required
        var date;
        if(date_year === "00" && date_month ==="00" && date_day ==="00"){
            date = "None";
        }
        else {
            date= date_day + "." + date_month + "." + "20" + date_year;
        }


        document.getElementById('account').innerHTML = iban;
        document.getElementById('reference').innerHTML = reference;
        document.getElementById('amount').innerHTML = amount;
        document.getElementById('date').innerHTML = date;

        //Generating a barcode(Code128) using JsBarcode API
        JsBarcode("#barcode", user_input);
    }
    else{
        alert("Enter a valid Virtual code!");
    }
}

