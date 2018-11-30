# field-day

### Vektorväljade visualiseerija

Inspiratsiooni saadud projektist https://anvaka.github.io/fieldplay/

Vajalik on brauser, milles töötab WebGL

Projekt kasutab raamistikke:
* WebGL
* Bootstrap.js
* JQuery
* MathJax

#### Tööpõhimõte

Kogu visuaali taga on WebGL, mis laseb graafikakaardil ära teha arvutusi mis tavalisel protsessoril oleksid liiga aeglased. Näiteks kui on tuhandeid osakesi, mida etteantud valemi järgi liigutatakse mööda tasandit, siis ainus viis seda saada normaalsel kaadrisagedusel käima on arvutused saata GPU-le. 

Selleks saab tekitada kaadri kus iga pikli 8-bitised R, G, B ja A väärtused tähistavad konkreetse osakese asukohta tasandil. Need asukohad dekodeeritakse tavalisteks float väärtusteks, arvutatakse valemi põhjal uued asukohad ning kodeeritakse uuesti piksliteks. Selle kaadri põhjal joonistatakse tasandile kõik punktid ning tsükkel võib uuesti alata.

Kuidas vektorväljad ise täpsemalt töötavad on projekti vahelehel nimega "vektorväljadest" antud sellest minimalistlik ülevaade.

**NB!** Hetkel on projekt suhteliselt poolik ja kuvab canvasele ainult osakeste asukohta kirjeldavatest pikslitest koosneva pildi. Reedeseks esitluseks on plaanis midagi töötavamat kokku kirjutada nüüd kus mul vaba aega on lõpuks tekkinud.

#### Tiimi liikmed ja ülesannete jaotus

* Adrian Kirikal
    * JavaScriptiga canvasele joonistamine, WebGLi jooksutamine, shaderite kirjutamine

* Kaarel Kaasla
    * Projekti *front-end* osa. Lehe struktuur puhtas HTML-s, kujundus (CSS) Bootstrapis ning interaktiivsus kasutades jQuery. Lisaks minimalistlik ülevaade vektorväljadest kasutades MathJax teeki.

#### Tekkinud raskused

##### Adrian:

Projekti keskel arvasin järgnevat:

> Algselt raskusi ei tekkinud. Hakkasin uurima kuidas töötab WebGL ja kuidas sellega graafikat teha. Mul ideed ülesande lahendamiseks on olemas seega praegu põhiline asi ongi mõtete kirja panemine ja siis nende WebGL-is implementeerimine. See on aga suht aeganõudev sest arvutigraafika on suht uus teema minu jaoks ning näiteks ainult kolmnurga ekraanile kuvamine on võtnud umbes 6h aega. Samas olen optimistilik et edasi läheb kiiremini.

Projekti lõpuks:

Üldiselt olen üsna hea ülevaate saanud arvutigraafikast ja shaderite kirjutamisest. Õppisin kasutama keelt GLSL, mis on küll 95% C süntaks aga midagi uut sain ikka teada. Ajapuuduse tõttu ei ole jõudnud rakendust nii valmis kirjutada kui oleksin tahtnud, aga ma arvatavasti töötan selle kallal tulevikus edasi sest teema on mulle täiega huvitav.

##### Kaarel:

Projekti keskel arvasin järgnevat:

>Otseselt ühtegi raskust, mida omal käel ära ei suudaks lahendada, seni tekkinud pole. Hetkel on projekti *front-end* tehtud Bootstrap ja jQuery-ga, aga lõppversiooni puhul on plaan kirjutada suurem osa kasutades Vue.js raamistikku. Demo puhul on kasutatud Bootstrappi põhjusel, sest see võimaldab luua võrdlemisi kiiresti hea väljanägemisega prototüüpe mis annavad aimu milline lõppversioon olema saab. Samas saab projekti hilisemas faasis selle koodi efektiivsemalt ümber kirjutada.

Projekti lõpuks:

Projekti alustades oli plaan kirjutada disain puhtas CSS keeles ning interaktiivsus kasutades Vue.js raamistikku, aga projekti lõppversioon kasutab vastavalt Bootstrappi ning jQuery teeki milles oli ka demo kirjutatud. Põhjus selle taga oli, et Bootstrap pakub funktsionaalsust üsna kerge vaevaga visuaalselt ilusat disaini luua ning selle asja vähemalt sama hästi puhtas CSS keeles kirjutamine oleks olnud palju aeganõudvam ja keerulisem töö. Seetõttu ei näinud mõtet hakata konkreetse projekti raames uuesti "ratast leiutama" hakata ja valisin variandi mis efektiivsemalt sama eesmärgi ära täitis. Lisaks kasutasin planeeritud Vue.js raamistiku asemel jQuery teeki, sest projekti käigus selgus, et *front-end* osas tuleb JavaScripti võrdlemisi vähe kirjutada ja sisuliselt kõik mis vajalik sai juba demo jaoks jQuery kasutades valmis kirjutatud. Seetõttu ei näinud mõtet hakata lihtsalt põhimõtte pärast täpselt sama asja kasutades teist raamistikku kasutades ümber kirjutama kui koodi efektiivsus sisuliselt samaks jääb. Üldiselt võin projekti lõpuks öelda, et sain selle raames paremaks *front-end* arenduses ning olen kindel, et see tuleb ka tulevikus kasuks. Näiteks õppisin konkreetselt selle projekti jaoks Vue.js raamistiku ära ja kuigi seda lõpuks ei kasutanud, siis on kindlasti tegemist asjaga mis tööturul või tulevaste projektide (näiteks veebirakenduste loomise aine) raames kasulik teada tuleb.
