d(function () {
    'use strict';
    window.addEventListener('load', on_load, false);

    function on_load() {

        //Der Zeichensatz 'CP1252'(Windows-1252 oder ANSI) basiert auf ISO 8859-1

        //var ANSI = 'CP1252';

        //Folgendes dass auch in ie und edge geht!
        var ANSI = 'ISO-8859-1';

        //Events
        window.addEventListener('keydown', on_keydown, false);
        slider1.addEventListener('input', on_input_S, false);
        slider1.addEventListener('change', on_input_S, false);

        start_button1.addEventListener('click', ausfuehren, false);
        textarea1.addEventListener('input', on_input, false);
        speichern_button1.addEventListener('click', speichern, false);
        holen_button1.addEventListener('click', holen, false);
        file1.addEventListener('change', on_change_F, false);


        //*****Drag and Drop vom PC in das Browser-Textfeld*********************************************

        //Standard Verhalten Unterbinden weil sonst -> (öffnet eine neue Seite mit dem Text)!
        window.addEventListener('dragover', function (e) {
            e.preventDefault();
        }, false);
        //Für Chrom nötig wenn daneben gezogen, sonst -> (öffnet eine neue Seite mit dem Text)!
        document.addEventListener('drop', function (e) {
            e.preventDefault();
        }, false);
        //Drag and Drop Einrichten
        textarea1.addEventListener('drop', on_drop, false);

        function on_drop(e) {
            var fReader = new FileReader();

            if (checkbox1.checked) {
                fReader.readAsText(e.dataTransfer.files[0], ANSI);
            } else {
                fReader.readAsText(e.dataTransfer.files[0]);
            }

            fReader.onload = function () {
                textarea1.value = fReader.result;
            }
        }

        //**********************************************************************************************


        if (window.localStorage) {
            textarea1.value = localStorage.getItem('text1');
            if (localStorage.slider1 != undefined) {
                slider1.value = localStorage.getItem('slider1');
                on_input_S();
            }
        }

        //IE null Problem beheben(wird in Textarea angezeigt)
        if (textarea1.value === 'null')
            textarea1.value = '';

        //File Auswählen (läuft fast gleich wie beim Drag and Drop)
        //'e.target...' statt 'e.dataTransfer...'
        function on_change_F(e) {
            var fReader = new FileReader();


            if (checkbox1.checked) {
                fReader.readAsText(e.target.files[0], ANSI);
            } else {
                fReader.readAsText(e.target.files[0]);
            }

            fReader.onload = function () {
                textarea1.value = fReader.result;
            }
        }


        function on_input_S() {
            textarea1.style.fontSize = slider1.value + 'px';
            textarea2.style.fontSize = slider1.value + 'px';
        }

        function on_input(e) {
            if (window.localStorage) {
                if (textarea1.value === localStorage.getItem('text1')) {
                    speichern_button1.classList.remove("redBackground");
                    speichern_button1.classList.add("greenBackground");
                } else {
                    speichern_button1.classList.remove("greenBackground");
                    speichern_button1.classList.add("redBackground");
                }
            }
        }

        function on_keydown(e) {
            if (e.key === 'Enter')
                ausfuehren();
            if (e.keyCode === 38)
                document.execCommand('redo', false, null);
            if (e.keyCode === 40)
                document.execCommand('undo', false, null);
        }


        //*************   Parser   **********************************************************
        /////////////////////////////////////////////////////////////////////////////////////

        function ausfuehren() {
            var temp;
            temp = textarea1.value;
            console.log(temp);

            //Alles unnötige Rausputzen! :)))
            temp = temp.replace(/;/gim, '');
            temp = temp.replace(/^BEGIN:VCARD/gim, '');
            temp = temp.replace(/^END:VCARD/gim, '');
            temp = temp.replace(/^VERSION:.*/gim, '');
            temp = temp.replace(/CHARSET=.*:/gim, ':');
            temp = temp.replace(/:/gim, ': ');

            //Hier nur erste Zeile von Photo weg :(
            temp = temp.replace(/^PHOTO.*/gim, '');

            //Macht die restlichen Photo-Daten weg! :)))
            temp = temp.replace(/^ .*\n/gim, '');


            //&&&&&&&&&&&  Decode CHARSET=  %%%%%%%%%%%%%%%

            // Wenn match nichts findet gibt null zurück!
            var arr = temp.match(/(=..=.*=..$|%..%.*%..$)/gim);


            if (arr !== null) {

                //Hier werden einfach '=' durch '%' ersetzt! ;)
                for (var x = 0; x < arr.length; x++) {
                    arr[x] = arr[x].replace(/={1}/g, '%');
                }

                //Hier wird decodiert
                for (var x = 0; x < arr.length; x++) {
                    arr[x] = decodeURI(arr[x]);
                }


                //Alle decodierten Werte Ersetzen im ganzen Text
                for (var x = 0; x < arr.length; x++) {
                    temp = temp.replace(/(=..=.*=..$|%..%.*%..$)/m, arr[x]);
                }

            }

            //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

            //Stellt Autokorrektur zurück(Rote Wellenlinien)
            textarea2.value = '';

            //Ergebnis Eintragen
            textarea2.value = temp;
            console.log('T', temp);
        }

        /////////////////////////////////////////////////////////////////////////////////////
        //***********************************************************************************


        function speichern() {
            if (window.localStorage) {
                localStorage.setItem('text1', textarea1.value);
                speichern_button1.classList.remove("redBackground");
                speichern_button1.classList.add("greenBackground");

                localStorage.setItem('slider1', slider1.value);
            }
        }

        function holen() {
            if (window.localStorage) {
                window.location.reload();
            }
        }
    }
})();