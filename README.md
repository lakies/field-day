# field-day

### Vektorväljade visualiseerija

Inspiratsiooni saadud projektist https://anvaka.github.io/fieldplay/

Vajalik on brauser, milles töötab WebGL

Projekt kasutab raamistikke:
* WebGL
* Bootstrap.js
* JQuery

#### Tööpõhimõte

Kogu visuaali taga on WebGL, mis laseb graafikakaardil ära teha arvutusi mis tavalisel protsessoril oleksid liiga aeglased. Siin mul on tuhandeid osakesi, mida etteantud valemi järgi liigutatakse mööda tasandit. Ainus viis seda saada normaalsel FPS-il käima on arvutused saata GPU-le. 

Selleks tekitan kaadri kus iga pikli 8-bitised R, G, B ja A väärtused tähistavad konkreetse osakese asukohta tasandil. Need asukohad dekodeeritakse tavalisteks float väärtusteks, arvutatakse valemi põhjal uued asukohad ning kodeeritakse uuesti piksliteks. Selle kaadri põhjal ma joonistan tasandile kõik punktid ning tsükkel võib uuesti alata.

**NB!** Hetkel on projekt suht poolik ja kuvab canvasele ainult osakeste asukohta kirjeldavatest pikslitest koosneva pildi. Reedeseks esitluseks on plaanis midagi töötavamat kokku kirjutada nüüd kus mul vaba aega on lõpuks tekkinud.

#### Tiimi liikmed ja ülesannete jaotus

* Adrian Kirikal
    * JavaScriptiga canvasele joonistamine, WebGLi jooksutamine, shaderite kirjutamine

* Kaarel Kaasla
    * BootStrapiga frontend, vektoreid tutvustav vaheleht...[lisa siia veel]

#### Tekkinud raskused

##### Adrian:

Projekti keskel arvasin järgnevat:

> Algselt raskusi ei tekkinud. Hakkasin uurima kuidas töötab WebGL ja kuidas sellega graafikat teha. Mul ideed ülesande lahendamiseks on olemas seega praegu põhiline asi ongi mõtete kirja panemine ja siis nende WebGL-is implementeerimine. See on aga suht aeganõudev sest arvutigraafika on suht uus teema minu jaoks ning näiteks ainult kolmnurga ekraanile kuvamine on võtnud umbes 6h aega. Samas olen optimistilik et edasi läheb kiiremini.

Üldiselt olen üsna hea ülevaate saanud arvutigraafikast ja shaderite kirjutamisest. Õppisin kasutama keelt GLSL, mis on küll 95% C süntaks aga midagi uut sain ikka teada. Ajapuuduse tõttu ei ole jõudnud rakendust nii valmis kirjutada kui oleksin tahtnud, aga ma arvatavasti töötan selle kallal tulevikus edasi sest teema on mulle täiega huvitav.

##### Kaarel:

Otseselt ühtegi raskust, mida omal käel ära ei suudaks lahendada, seni tekkinud pole. Hetkel on projekti "front-end" tehtud Bootstrap ja jQuery-ga, aga lõppversiooni puhul on plaan kirjutada suurem osa kasutades Vue.js raamistikku. Demo puhul on kasutatud Bootstrappi põhjusel, sest see võimaldab luua võrdlemisi kiiresti hea väljanägemisega prototüüpe mis annavad aimu milline lõppversioon olema saab. Samas saab projekti hilisemas faasis selle koodi efektiivsemalt ümber kirjutada.