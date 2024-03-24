import terrains from './terrains.js'
import { arrowFromDirection,sectorFromDirection } from './arrows.js'
import code_meteo from './weather_code.js'
const choices = document.getElementById("terrains")
const tableau = document.getElementById("tableau")
const button = document.getElementById("button")
const checkBox_compatible=document.getElementById("compatible")
const radio1J=document.getElementById("1j")
const radio2J=document.getElementById("2j")
const radio3J=document.getElementById("3j")
const radio4J=document.getElementById("4j")
//numero de balise de vent sur openwindmap.org
const rissas={name: "rissas", id:1463}
const graveyron={id:815, name: "graveyron"}// l'attribut name doit correspondre au container canvas associé sur la page. ce canvas servira a indiquer le vent
const saint_amand={id:1336, name: "saint_amand"}
const rustrel={id:601, name:"rustrel"}
const banon={id:157, name:"banon"}
const bergies={id:1309, name:"bergies"}
const balisesVent=[rissas,graveyron,saint_amand,rustrel,banon,bergies]
const converDate = (date)=>{
        const mois = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"]
        const mois_chiffre = ["01","02","03","04","05","06","07","08","09","10","11","12"]
        const jours = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]
        const jours_short = ["dim","lun","mar","mer","jeu","ven","sam"]
        const d = new Date(date)
        //const heure= d.getHours() 
        const heure = date.split('-')[2].split('T')[1]
        const annee = d.getFullYear()
        const minute=d.getMinutes()
        //const jour=d.getDate()
        const jour=date.split('-')[2].split('T')[0]
        const jour_clair=jours_short[d.getDay()]
        const mois_clair = mois_chiffre[d.getMonth()]
        //return `${jour_clair} ${jour} ${mois_clair } ${annee} ${heure}h `
        return `${jour_clair} ${jour}/${mois_clair } ${heure}h `//version d'affichage courte sans l'année parcequ'on s'en fout un peu...
}

for(let key in terrains){
//    console.log(key)
    let elem=document.createElement("option")
    elem.value=key
    let node=document.createTextNode(terrains[key].name)
    elem.appendChild(node)
    choices.appendChild(elem)
}
const printMeteo = async (site,available,dforecast)=>{
    const choice_site=terrains[site]
    const LAT=choice_site.lat
    const LON=choice_site.lon
    const url = `https://api.open-meteo.com/v1/meteofrance?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=${dforecast}&models=best_match`
    const response = await fetch(url)
    const forecast=await response.json()
    const date_time = forecast.hourly.time.map(converDate)
    const wind_speed_10m=forecast.hourly.wind_speed_10m
    const wind_direction_10m=forecast.hourly.wind_direction_10m
    const wind_gusts_10m = forecast.hourly.wind_gusts_10m
    const weather_code = forecast.hourly.weather_code.map((value)=>{return code_meteo[value.toString()].day.description})
    const weather_picto = forecast.hourly.weather_code.map((value)=>{return code_meteo[value.toString()].day.image})
    const wind_dir_10m_symbol=wind_direction_10m.map(arrowFromDirection)
    const wind_dir_10m_sector=wind_direction_10m.map(sectorFromDirection)
    const temperature_2m=forecast.hourly.temperature_2m
    const display=(index)=>{
        var ladate=date_time[index]
        var ventSymbol=wind_dir_10m_symbol[index]
        var dirVent=wind_direction_10m[index].toString().padStart(3,"0")//on complete la direction avec des zero pour affichage propre
        var VitesseVent=wind_speed_10m[index].toFixed(1).toString().padStart(4,' ')//précision 1 décimal et espace devant si besoin pour avoir un affichage propre
        var VitesseRafale=wind_gusts_10m[index].toFixed(1).toString().padStart(4,' ')
        var codeMeteo = weather_code[index].padEnd(24,' ')
        var pictoMeteo=document.createElement('img')
        pictoMeteo.src=weather_picto[index]
        pictoMeteo.style.width="35px"
        var temperature = temperature_2m[index]
//        const array_of_data=[ladate,ventSymbol,dirVent+'°',VitesseVent+'/'+VitesseRafale+"km/h",codeMeteo,'T°:'+temperature+'c°'] 
        //affichage meteo sous forme d'image
        const array_of_data=[ladate,ventSymbol,dirVent+'°',VitesseVent+'/'+VitesseRafale+" km/h",codeMeteo,pictoMeteo,temperature+'c°'] 
        //creation des lignes de tableaux
        let row = document.createElement("tr")
        for (var data of array_of_data){
            let cell = document.createElement("td")
            //on isole le pictoMeteo qui doit etre traité comme un élement image
            if(typeof(data)=="object"){
                cell.appendChild(data)
            }else{

                cell.innerHTML=data
            }
//            cell.appendChild(data)
            row.appendChild(cell)
        } 
        tableau.appendChild(row)
//        console.log(ladate,"\tvent",ventSymbol,dirVent+"°",VitesseVent+"/"+VitesseRafale+" km/h",codeMeteo,"T°", temperature+'°c')
    }

    wind_dir_10m_sector.forEach((value,index)=>{
        if(available){//si l'option a ou available est entrée on filtre les secteurs de vent compatibles avec le site
            if (choice_site.secteurs.includes(value)){
                display(index)
            }

        }else{
            display(index)
        }
    })
}
const clearRows = ()=>{
    let all_rows=document.querySelectorAll("td")
    for(var row of all_rows){
        row.remove()
    }
}

choices.onchange=()=>{
    clearRows()
    printMeteo(choices.value,checkBox_compatible.checked,forecast_duration())
}

checkBox_compatible.onchange = ()=>{
    //console.log(checkBox_compatible.checked)
    clearRows()
    printMeteo(choices.value,checkBox_compatible.checked,forecast_duration())


}

const forecast_duration= ()=>{
    var n=radio1J.value*radio1J.checked + radio2J.value*radio2J.checked + radio3J.value*radio3J.checked + radio4J.value*radio4J.checked
    //console.log(n)
    return n
}

radio1J.onclick=()=>{
    clearRows()
    printMeteo(choices.value,checkBox_compatible.checked,forecast_duration())
}
radio2J.onclick=()=>{
    clearRows()
    printMeteo(choices.value,checkBox_compatible.checked,forecast_duration())
}
radio3J.onclick=()=>{
    clearRows()
    printMeteo(choices.value,checkBox_compatible.checked,forecast_duration())
}
radio4J.onclick=()=>{
    clearRows()
    printMeteo(choices.value,checkBox_compatible.checked,forecast_duration())
}

//const n_previ=document.getElementById("n_previ")
//n_previ.onchange=()=>{
//    clearRows()
//    printMeteo(choices.value,checkBox_compatible.checked,n_previ.value)
//}
const convertDuration = (duree) =>{
        //convertit une durée donnée en millisec  en seconde ou  heure ou jour ou minute
        if (duree < 60){
                return `${duree.toFixed(0)} secondes`
        }else if (duree < 3600){
                const mn = duree/60
                return `${mn.toFixed(0)} minutes`
        }else if (duree < 86400){
                const hr=duree/3600
                return `${hr.toFixed(0)} heure(s)`
        }else {
                const jour = duree/86400
                return `${jour.toFixed(0)} jours(s)`
        }
                
}
const printBalise = async (balise)=>{
        const url =  `http://api.pioupiou.fr/v1/live/${balise.id}`
        const response  = await fetch(url) 
        const liveWind = await response.json()
        const time = new Date(liveWind.data.measurements.date)
        const timeRef= time.getTime()
        let heading = liveWind.data.measurements.wind_heading
        if (heading==0){heading=360}
        const avg_wind = liveWind.data.measurements.wind_speed_avg
        const max_wind= liveWind.data.measurements.wind_speed_max
        const divWind = document.getElementById(`${balise.name}-wind`)
        const maintenant = Date.now() // l'heure actuelle en millisec depuis 1970
        const lastMeasure = (maintenant-timeRef)/1000
        const timeSinceLastMeasure = convertDuration(lastMeasure)
        //console.log(heading)
        //console.log(avg_wind)
        //console.log(max_wind)
        const canvas = document.getElementById(balise.name)
        const ctx = canvas.getContext("2d")
        const windValues = `${avg_wind}/${max_wind} km/h </br> il y a ${timeSinceLastMeasure}`
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)
        ctx.translate(25,25)
        ctx.rotate(Math.PI+heading*Math.PI/180)
        
        ctx.beginPath()
        ctx.fillStyle ="#0DCAF0"
        ctx.arc(0,0,25,0,2*Math.PI)
        ctx.fill()

        ctx.beginPath()
        //ctx.moveTo(0,20)
        //ctx.lineTo(0,-20)
        //ctx.lineTo(5,-15)
        //ctx.lineTo(-5,-15)
        //ctx.lineTo(0,-20)
        //ctx.lineTo(0,20)
        // dessin d'une fleche pour indiquer la direction du vent
        ctx.moveTo(-5,20)
        ctx.lineTo(0,-20)
        ctx.lineTo(5,20)
        ctx.closePath()
        ctx.fillStyle = "#003300"
        ctx.fill()
        //ctx.stroke()
        ctx.rotate(-Math.PI-heading*Math.PI/180)
        ctx.translate(-25,-25)
        ctx.fillStyle="#FFFF66"
        ctx.textAlign="center"
        ctx.textBaseline="middle"
        ctx.font="bold 12px Arial"
        ctx.fillText(heading.toFixed(0)+"°",25,25)
        //console.log(`il y a ${timeSinceLastMeasure}`)
        //console.log(lastMeasure)
        divWind.innerHTML=windValues
}
printMeteo(choices.value,checkBox_compatible.checked,forecast_duration())
for (let balise of balisesVent){
        printBalise(balise)
}

for (let balise of balisesVent){
        document.getElementById(balise.name).onclick= ()=>{printBalise(balise)}
}
