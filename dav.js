var offers;
var conditions;
var offersRaw;
var conditionsRaw;
var spellbookJson;
var firstDav;
var eventListenersPrimed = false;
var custom = false;
var emblemErr = false;

let offersLink = "https://tmbo.xyz/wp-content/uploads/2022/05/dav-offers.utf-8";
let conditionsLink = "https://tmbo.xyz/wp-content/uploads/2022/05/dav-conditions.utf-8";
let presetsLink = "https://tmbo.xyz/wp-content/uploads/2022/05/dav-presets.utf-8";

let titlename =
	"<a href='https://scryfall.com/card/j21/15/davriel-soul-broker' class='link dav' target='_blank' rel='noopener noreferrer'>Davriel's</a>";
let textname = "Davriel's";

async function fetchText(link) {
	let response = await fetch(/*"https://cors-tmb-io.herokuapp.com/?" + */link);
	let data = await response.text();
	return data;
}

async function fetchJSON(link) {
	let response = await fetch(/*"https://cors-tmb-io.herokuapp.com/?" + */link);
	let data = await response.json();
	return data;
}

function preloadImage(url) {
	var img = new Image();
	img.src = url;
	document.getElementById("preloadCache").appendChild(img);
}

async function davFetchAll(state, type) {
	var offerLinkCustom = document.getElementById("offerLinkCustom");
	var conditionLinkCustom = document.getElementById("conditionLinkCustom");
	var offerTextCustom = document.getElementById("offerTextCustom");
	var conditionTextCustom = document.getElementById("conditionTextCustom");
	if (state === "load") {
		offersRaw = await fetchText(offersLink);
		conditionsRaw = await fetchText(conditionsLink);
		custom = false;
	}
	if (state === "custom") {
		if (type === "link") {
			offersRaw = await fetchText(offerLinkCustom.value);
			offersLink = offerLinkCustom.value;
			conditionsRaw = await fetchText(conditionLinkCustom.value);
			conditionsLink = conditionLinkCustom.value;
		} else if (type === "text") {
			offersRaw = offerTextCustom.value;
			offersLink = "";
			conditionsRaw = conditionTextCustom.value;
			conditionsLink = "";
		}
		custom = true;
		titlename = "Custom";
		textname = "the custom";
	}
	davSetAll();
}

function davSetAll() {
	offerLinkCustom.value = offersLink;
	conditionLinkCustom.value = conditionsLink;
	offerTextCustom.value = offersRaw;
	offerTextCustom.style.height = "auto";
	textareaFix(offerTextCustom);
	conditionTextCustom.value = conditionsRaw;
	textareaFix(conditionTextCustom);
	var offersFixed = manafontify(offersRaw);
	var conditionsFixed = manafontify(conditionsRaw);
	offers = cleanArray(offersFixed.split(/\r?\n/));
	conditions = cleanArray(conditionsFixed.split(/\r?\n/));
	var dispOffers = document.getElementById("dispDavOffers");
	var dispConditions = document.getElementById("dispDavConditions");
	dispOffers.innerHTML = "";
	var offersH = document.createElement("h3");
	offersH.classList.add("dav-h", "underlined");
	offersH.innerHTML = titlename + " Offers";
	dispOffers.appendChild(offersH);
	var homeBtnO = document.createElement("button");
	homeBtnO.classList.add("dav-button", "link-home", "set-own-listener");
	homeBtnO.innerHTML = "<strong>←</strong> Back";
	homeBtnO.addEventListener("click", function () {
		setDisp("dispDavHome", "dav");
	});
	dispOffers.appendChild(homeBtnO);
	for (var i = 0; i < offers.length; i++) {
		var newP = document.createElement("p");
		newP.classList.add("dav-p");
		newP.innerHTML = offers[i];
		dispOffers.appendChild(newP);
		var breakP = document.createElement("p");
		dispOffers.appendChild(breakP);
	}
	var homeBtnO = document.createElement("button");
	homeBtnO.classList.add("dav-button", "link-home", "set-own-listener");
	homeBtnO.innerHTML = "<strong>←</strong> Back";
	homeBtnO.addEventListener("click", function () {
		setDisp("dispDavHome", "dav");
	});
	dispOffers.appendChild(homeBtnO);
	dispConditions.innerHTML = "";
	var conditionsH = document.createElement("h3");
	conditionsH.classList.add("dav-h", "underlined");
	conditionsH.innerHTML = titlename + " Conditions";
	dispConditions.appendChild(conditionsH);
	var homeBtnC = document.createElement("button");
	homeBtnC.classList.add("dav-button", "link-home", "set-own-listener");
	homeBtnC.innerHTML = "<strong>←</strong> Back";
	homeBtnC.addEventListener("click", function () {
		setDisp("dispDavHome", "dav");
	});
	dispConditions.appendChild(homeBtnC);
	for (var i = 0; i < offers.length; i++) {
		var newP = document.createElement("p");
		newP.classList.add("dav-p");
		newP.innerHTML = conditions[i];
		dispConditions.appendChild(newP);
		var breakP = document.createElement("p");
		dispConditions.appendChild(breakP);
	}
	var homeBtnC = document.createElement("button");
	homeBtnC.classList.add("dav-button", "link-home", "set-own-listener");
	homeBtnC.innerHTML = "<strong>←</strong> Back";
	homeBtnC.addEventListener("click", function () {
		setDisp("dispDavHome", "dav");
	});
	dispConditions.appendChild(homeBtnC);
	var textnames = document.querySelectorAll(".textname");
	for (var i = 0; i < textnames.length; i++) {
		textnames[i].innerHTML = textname;
	}
	var placeholders = document.querySelectorAll(".placeholder");
	for (var i = 0; i < placeholders.length; i++) {
		placeholders[i].classList.remove("placeholder");
	}
	var placeholders = document.querySelectorAll(".placeholder-wave");
	for (var i = 0; i < placeholders.length; i++) {
		placeholders[i].classList.remove("placeholder-wave");
	}
	eventListenersPrimed = true;
}

davFetchAll("load");

async function loadSpellbooks() {
	var query = "?q=" + encodeURIComponent("has:spellbook");
	spellbookJson = await fetchJSON(
		"https://api.scryfall.com/cards/search" + query
	);
	preloadSpellbookImgs();
	for (var i = 0; i < spellbookJson.data.length; i++) {
		newSIOption("draftInput", spellbookJson.data[i].name); //
		loadSI();
	}
	loadSI();
}

loadSpellbooks();

async function preloadSpellbookImgs() {
	for (var i = 0; i < spellbookJson.data.length; i++) {
		var sbfor = spellbookJson.data[i].name.replace(/[!'()*]/g, "");
		var addtext = "";
		if (sbfor.toLowerCase() === "key to the archive") var addtext = " set:sta";
		var query =
			"?q=" +
			encodeURIComponent("spellbook:'" + sbfor + "' unique:cards" + addtext);
		var json = await fetchJSON("https://api.scryfall.com/cards/search" + query);
		for (var j = 0; j < json.data.length; j++) {
			if (json.data[j].image_uris) preloadImage(json.data[j].image_uris.normal);
			else {
				preloadImage(json.data[j].card_faces[0].image_uris.normal);
				preloadImage(json.data[j].card_faces[1].image_uris.normal);
			}
		}
	}
}

function cleanArray(arr) {
	var temp = [];
	for (let i of arr) i && temp.push(i);
	return temp;
}

document
	.getElementById("submitPresetCustom")
	.addEventListener("click", presetChanger);

document
	.getElementById("submitLinkCustom")
	.addEventListener("click", function () {
		customContracts("link");
	});

document
	.getElementById("submitTextCustom")
	.addEventListener("click", function () {
		customContracts("text");
	});

function customContracts(type) {
	if (type !== "preset") davFetchAll("custom", type);
	if (type !== "preset")
		document.getElementById("davTitleH").innerHTML =
			"<span id='davTitle' class='underlined'>Custom Contract</span>";
	document.getElementById("davEmblemDisp").innerHTML = "";
	document.getElementById("davAllDisp").innerHTML = "";
	document.getElementById("davCurrentDisp").innerHTML = "";
	document.getElementById("davAllBtn").classList.add("off");
	document.getElementById("davCurrentBtn").classList.add("off");
	var allActive = document.querySelectorAll(".active");
	var actLength = allActive == null ? 0 : allActive.length;
	for (var j = 0; j < actLength; j++) {
		if (this.id !== allActive[j].id) {
			allActive[j].classList.remove("active");
			var content = allActive[j].nextElementSibling;
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + "px";
			}
		}
	}
	setDisp("dispDavHome", "dav");
}

var presetsRaw;
var presets;
var presetsListFormatted = [];
var presetsList = [];
async function loadPresets() {
	presetsRaw = await fetchText(presetsLink);
	presets = presetsRaw
		.replace(/(\r?\n&-.*-&\r?\n)|(\r?\n&-.*-&)|(&-.*-&\r?\n)/g, "&--&")
		.split(/&--&/g);
	var temp = presets;
	for (var j = 0; j < presets.length / 4; j++) {
		var tempOffersRaw = temp[2];
		var tempConditionsRaw = temp[3];
		var tempName = classifyVar(temp[0]);
		presetsList.push(temp[0]);
		presetsListFormatted.push(tempName);
		var tempObjName = "globalThis." + tempName + "Obj";
		var tempOName = "globalThis." + tempName + "Offers";
		var tempCName = "globalThis." + tempName + "Conditions";
		eval(tempObjName + " = " + temp[1]);
		eval(tempOName + " = " + JSON.stringify(temp[2]));
		eval(tempCName + " = " + JSON.stringify(temp[3]));
		var temp = temp.slice(4);
	}
	for (var j = 0; j < presetsList.length; j++) {
		var opt = document.createElement("option");
		opt.value = presetsListFormatted[j];
		opt.innerHTML = presetsList[j];
		document.getElementById("presetCustom").appendChild(opt);
	}
}

loadPresets();

function presetChanger() {
	var preset = document.getElementById("presetCustom").value;
	var tempObjName = preset + "Obj";
	var tempOName = preset + "Offers";
	var tempCName = preset + "Conditions";
	eval(
		"document.getElementById('davTitleH').innerHTML = " + tempObjName + ".title"
	);
	eval("custom = " + tempObjName + ".custom");
	eval("textname = " + tempObjName + ".textname");
	eval("titlename = " + tempObjName + ".titlename");
	eval("offersRaw = " + tempOName);
	eval("conditionsRaw = " + tempCName);
	davSetAll();
	customContracts("preset");
}

var settingsLinks = document.getElementsByClassName("settings");
function runSettingsLinks() {
	for (var i = 0; i < settingsLinks.length; i++) {
		if (settingsLinks[i].classList.contains("set-own-listener")) break;
		if (settingsLinks[i].classList.contains("dav")) var isFor = "Dav";
		else if (settingsLinks[i].classList.contains("draft")) var isFor = "Draft";
		else if (settingsLinks[i].classList.contains("momir")) var isFor = "Momir";
		else if (settingsLinks[i].classList.contains("mjs")) var isFor = "Mjs";
		else if (settingsLinks[i].classList.contains("urza")) var isFor = "Urza";
		else if (settingsLinks[i].classList.contains("venture")) var isFor = "Venture";
		else break;
		settingsLinks[i].linkFor = isFor;
		settingsLinks[i].addEventListener("click", function () {
			setDisp("disp" + this.linkFor + "Settings", this.linkFor.toLowerCase());
		});
	}
}
runSettingsLinks();
var homeLinks = document.getElementsByClassName("link-home");
function runHomeLinks() {
	for (var i = 0; i < homeLinks.length; i++) {
		if (homeLinks[i].classList.contains("set-own-listener")) break;
		if (homeLinks[i].classList.contains("dav")) var isFor = "Dav";
		else if (homeLinks[i].classList.contains("draft")) var isFor = "Draft";
		else if (homeLinks[i].classList.contains("momir")) var isFor = "Momir";
		else if (homeLinks[i].classList.contains("mjs")) var isFor = "Mjs";
		else if (homeLinks[i].classList.contains("urza")) var isFor = "Urza";
		else if (homeLinks[i].classList.contains("venture")) var isFor = "Venture";
		else break;
		homeLinks[i].linkFor = isFor;
		homeLinks[i].addEventListener("click", function () {
			setDisp("disp" + this.linkFor + "Home", this.linkFor.toLowerCase());
		});
	}
}
runHomeLinks();
document.getElementById("davOffersLink").addEventListener("click", function () {
	setDisp("dispDavOffers", "dav");
});
document
	.getElementById("davConditionsLink")
	.addEventListener("click", function () {
		setDisp("dispDavConditions", "dav");
	});

function setDisp(innerName, isFor) {
	var innerToDisp = document.getElementById(innerName);
	var allInners = document
		.getElementById(isFor + "Div")
		.querySelectorAll(".disp-box-inner");
	for (var i = 0; i < allInners.length; i++) {
		allInners[i].classList.add("hidden");
	}
	innerToDisp.classList.remove("hidden");
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
}

let innerBtns = document.querySelectorAll(".inner-button");
for (var i = 0; i < innerBtns.length; i++) {
	innerBtns[i].addEventListener("click", function () {
		var parent = this.parentElement.parentElement;
		var btns = parent.querySelectorAll(".inner-button");
		var togglables = parent.querySelectorAll(".ib-togglable");
		for (var j = 0; j < btns.length; j++) {
			btns[j].classList.toggle("off");
		}
		for (var j = 0; j < togglables.length; j++) {
			togglables[j].classList.toggle("hidden");
		}
		parent.style.maxHeight = parent.scrollHeight + "px";
	});
}

let siteTypeSels = document.querySelectorAll(".thumb-container");
let sites = document.querySelectorAll(".site-main");
for (var i = 0; i < siteTypeSels.length; i++) {
	siteTypeSels[i].addEventListener("click", function () {
		for (var j = 0; j < siteTypeSels.length; j++) {
			siteTypeSels[j].classList.add("inactive");
		}
		this.classList.remove("inactive");
		for (var j = 0; j < sites.length; j++) {
			sites[j].classList.add("hidden");
		}
		document
			.getElementById(this.getAttribute("data-siteId"))
			.classList.remove("hidden");
	});
}

let typeToggles = document.querySelectorAll(".type-toggle");
for (var i = 0; i < typeToggles.length; i++) {
	typeToggles[i].addEventListener("click", function () {
		for (var j = 0; j < typeToggles.length; j++) {
			typeToggles[j].classList.toggle("hidden");
		}
	});
}

var desktopBtns = document.querySelectorAll(".fa-desktop");
for (var i = 0; i < desktopBtns.length; i++) {
	desktopBtns[i].addEventListener("click", function () {
		changeViewerMode("mobile");
	});
}

var mobileBtns = document.querySelectorAll(".fa-mobile-screen-button");
for (var i = 0; i < mobileBtns.length; i++) {
	mobileBtns[i].addEventListener("click", function () {
		changeViewerMode("desktop");
	});
}

function changeViewerMode(type) {
	var doc = document.documentElement.style;
	if (type === "mobile") {
		var allEls = document.querySelectorAll("body *");
		for (var i = 0; i < allEls.length; i++) {
			allEls[i].classList.add("mobile");
		}
	} else if (type === "desktop") {
		var allEls = document.querySelectorAll("body *");
		for (var i = 0; i < allEls.length; i++) {
			allEls[i].classList.remove("mobile");
		}
	}
}

if (
	/iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(
		navigator.userAgent.toLowerCase()
	)
) {
	changeViewerMode("mobile");
	for (var i = 0; i < desktopBtns.length; i++) {
		desktopBtns[i].classList.add("hidden");
	}
	for (var i = 0; i < mobileBtns.length; i++) {
		mobileBtns[i].classList.remove("hidden");
	}
}

var tooltipFollowers = document.querySelectorAll(".tooltip-follow");

window.onmousemove = function (e) {
	tooltipFollowers = document.querySelectorAll(".tooltip-follow");
	var x = e.clientX;
	var y = e.clientY;
	for (var i = 0; i < tooltipFollowers.length; i++) {
		tooltipFollowers[i].style.top = y + 10 + "px";
		tooltipFollowers[i].style.left = x + 10 + "px";
	}
};

var th = ["", "thousand", "million", "billion", "trillion"];
var dg = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine"
];
var tn = [
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen"
];
var tw = [
	"twenty",
	"thirty",
	"forty",
	"fifty",
	"sixty",
	"seventy",
	"eighty",
	"ninety"
];

function toWords(s) {
	s = s.toString();
	s = s.replace(/[\, ]/g, "");
	if (s != parseFloat(s)) return "not a number";
	var x = s.indexOf(".");
	if (x == -1) x = s.length;
	if (x > 15) return "too big";
	var n = s.split("");
	var str = "";
	var sk = 0;
	for (var i = 0; i < x; i++) {
		if ((x - i) % 3 == 2) {
			if (n[i] == "1") {
				str += tn[Number(n[i + 1])] + " ";
				i++;
				sk = 1;
			} else if (n[i] != 0) {
				str += tw[n[i] - 2] + " ";
				sk = 1;
			}
		} else if (n[i] != 0) {
			// 0235
			str += dg[n[i]] + " ";
			if ((x - i) % 3 == 0) str += "hundred ";
			sk = 1;
		}
		if ((x - i) % 3 == 1) {
			if (sk) str += th[(x - i - 1) / 3] + " ";
			sk = 0;
		}
	}

	if (x != s.length) {
		var y = s.length;
		str += "point ";
		for (var i = x + 1; i < y; i++) str += dg[n[i]] + " ";
	}
	return str.replace(/\s+/g, " ").trim();
}

const txHeight = 76;
const tx = document.getElementsByTagName("textarea");
for (var i = 0; i < tx.length; i++) {
	if (tx[i].value == "") {
		tx[i].setAttribute("style", "height:" + txHeight + "px; overflow: hidden;");
		//console.log(tx[i].style.height)
	} else {
		tx[i].setAttribute(
			"style",
			"height:" + tx[i].scrollHeight + "px; overflow: hidden;"
		);
	}
	tx[i].addEventListener("input", textareaOnInput, false);
}

function textareaOnInput(e) {
	this.style.height = "auto";
	this.style.height = this.scrollHeight + 4 + "px";
}

function textareaFix(el) {
	el.style.height = "auto";
	el.style.height = el.scrollHeight + 4 + "px";
}

/*!
 * long-press.js
 * Pure JavaScript long-press event
 * https://github.com/john-doherty/long-press
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
/*! function(t, e) {
  "use strict";

  function n() {
    this.dispatchEvent(new CustomEvent("long-press", {
      bubbles: !0,
      cancelable: !0
    })), clearTimeout(o), console && console.log
  }
  var o = null,
    s = "ontouchstart" in t || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
    u = s ? "touchstart" : "mousedown",
    a = s ? "touchcancel" : "mouseout",
    i = s ? "touchend" : "mouseup";
  "initCustomEvent" in e.createEvent("CustomEvent") && (t.CustomEvent = function(t, n) {
    n = n || {
      bubbles: !1,
      cancelable: !1,
      detail: void 0
    };
    var o = e.createEvent("CustomEvent");
    return o.initCustomEvent(t, n.bubbles, n.cancelable, n.detail), o
  }, t.CustomEvent.prototype = t.Event.prototype), e.addEventListener(u, function(t) {
    var e = t.target,
      s = parseInt(e.getAttribute("data-long-press-delay") || "1500", 10);
    o = setTimeout(n.bind(e), s)
  }), e.addEventListener(i, function(t) {
    clearTimeout(o)
  }), e.addEventListener(a, function(t) {
    clearTimeout(o)
  })
}(this, document);

document.addEventListener('long-press', function(e) {
  if (e.target.id == "davTitle") {
    setDisp("dispDavSettings", "dav");
  }
});
*/

document.getElementById("runDav").addEventListener("click", runDav);

function manafontify(text) {
	var manaSymbols = [
		/* [regex, class, title, alt text, (trailing string)] */
		["{T}", "ms-tap ms-cost ms-shadow", "Tap", "{T}"],
		["{To}", "ms-tap-alt ms-cost ms-shadow", "Tap (Old)", "{To}"],
		["{Q}", "ms-untap ms-cost ms-shadow", "Untap", "{Q}"],
		["{E}", "ms-e", "Energy Counter", "{E}"],
		["{A}", "ms-acorn ms-cost ms-shadow", "Acorn Counter", "{A}"],
		["{W}", "ms-w ms-cost ms-shadow", "White Mana", "{W}"],
		["{Wo}", "ms-w-original ms-cost ms-shadow", "White Mana (Original)", "{Wo}"],
		["{Wl}", "ms-w-list ms-cost ms-shadow", "White Mana (The List)", "{Wl}"],
		["{U}", "ms-u ms-cost ms-shadow", "Blue Mana", "{U}"],
		["{B}", "ms-b ms-cost ms-shadow", "Black Mana", "{B}"],
		["{R}", "ms-r ms-cost ms-shadow", "Red Mana", "{R}"],
		["{G}", "ms-g ms-cost ms-shadow", "Green Mana", "{G}"],
		["{(Wh|W½|½W)}", "ms-w ms-half ms-cost ms-shadow", "½ White Mana", "{½W}"],
		["{(Uh|U½|½U)}", "ms-u ms-half ms-cost ms-shadow", "½ Blue Mana", "{½U}"],
		["{(Bh|B½|½B)}", "ms-b ms-half ms-cost ms-shadow", "½ Black Mana", "{½B}"],
		["{(Rh|R½|½R)}", "ms-r ms-half ms-cost ms-shadow", "½ Red Mana", "{½R}"],
		["{(Gh|G½|½G)}", "ms-g ms-half ms-cost ms-shadow", "½ Green Mana", "{½G}"],
		["{S}", "ms-s ms-cost ms-shadow", "Snow Mana", "{S}"],
		["{S2}", "ms-s-mtga ms-cost ms-shadow", "Snow Mana (MTG Arena)", "{S2}"],
		["{C}", "ms-c ms-cost ms-shadow", "Colorless Mana", "{C}"],
		["{W/P}", "ms-wp ms-cost ms-shadow", "Phyrexian White Mana", "{W/ϕ}"],
		["{U/P}", "ms-up ms-cost ms-shadow", "Phyrexian Blue Mana", "{U/ϕ}"],
		["{B/P}", "ms-bp ms-cost ms-shadow", "Phyrexian Black Mana", "{B/ϕ}"],
		["{R/P}", "ms-rp ms-cost ms-shadow", "Phyrexian Red Mana", "{R/ϕ}"],
		["{G/P}", "ms-gp ms-cost ms-shadow", "Phyrexian Green Mana", "{G/ϕ}"],
		["{W/U}", "ms-wu ms-cost ms-shadow", "Hybrid White/Blue Mana", "{W/U}"],
		["{W/B}", "ms-wb ms-cost ms-shadow", "Hybrid White/Black Mana", "{W/B}"],
		["{B/R}", "ms-br ms-cost ms-shadow", "Hybrid Black/Red Mana", "{B/R}"],
		["{B/G}", "ms-bg ms-cost ms-shadow", "Hybrid Black/Green Mana", "{B/G}"],
		["{U/B}", "ms-ub ms-cost ms-shadow", "Hybrid Blue/Black Mana", "{U/B}"],
		["{U/R}", "ms-ur ms-cost ms-shadow", "Hybrid Blue/Red Mana", "{U/R}"],
		["{R/G}", "ms-rg ms-cost ms-shadow", "Hybrid Red/Green Mana", "{R/G}"],
		["{R/W}", "ms-rw ms-cost ms-shadow", "Hybrid Red/White Mana", "{R/W}"],
		["{G/W}", "ms-gw ms-cost ms-shadow", "Hybrid Green/White Mana", "{G/W}"],
		["{G/U}", "ms-gu ms-cost ms-shadow", "Hybrid Green/Blue Mana", "{G/U}"],
		["{2/W}", "ms-2w ms-cost ms-shadow", "Twobrid White Mana", "{2/W}"],
		["{2/U}", "ms-2u ms-cost ms-shadow", "Twobrid Blue Mana", "{2/U}"],
		["{2/B}", "ms-2b ms-cost ms-shadow", "Twobrid Black Mana", "{2/B}"],
		["{2/R}", "ms-2r ms-cost ms-shadow", "Twobrid Red Mana", "{2/R}"],
		["{2/G}", "ms-2g ms-cost ms-shadow", "Twobrid Green Mana", "{2/G}"],
		["{X}", "ms-x ms-cost ms-shadow", "X Mana", "{X}"],
		["{Y}", "ms-y ms-cost ms-shadow", "Y Mana", "{Y}"],
		["{Z}", "ms-z ms-cost ms-shadow", "Z Mana", "{Z}"],
		["{(1/2|½)}", "ms-1-2 ms-cost ms-shadow", "½ Generic Mana", "{½}"],
		["{(0)}", "ms-0 ms-cost ms-shadow", "0 Generic Mana", "{0}"],
		["{(1)}", "ms-1 ms-cost ms-shadow", "1 Generic Mana", "{1}"],
		["{(2)}", "ms-2 ms-cost ms-shadow", "2 Generic Mana", "{2}"],
		["{(3)}", "ms-3 ms-cost ms-shadow", "3 Generic Mana", "{3}"],
		["{(4)}", "ms-4 ms-cost ms-shadow", "4 Generic Mana", "{4}"],
		["{(5)}", "ms-5 ms-cost ms-shadow", "5 Generic Mana", "{5}"],
		["{(6)}", "ms-6 ms-cost ms-shadow", "6 Generic Mana", "{6}"],
		["{(7)}", "ms-7 ms-cost ms-shadow", "7 Generic Mana", "{7}"],
		["{(8)}", "ms-8 ms-cost ms-shadow", "8 Generic Mana", "{8}"],
		["{(9)}", "ms-9 ms-cost ms-shadow", "9 Generic Mana", "{9}"],
		["{(10)}", "ms-10 ms-cost ms-shadow", "10 Generic Mana", "{10}"],
		["{(11)}", "ms-11 ms-cost ms-shadow", "11 Generic Mana", "{11}"],
		["{(12)}", "ms-12 ms-cost ms-shadow", "12 Generic Mana", "{12}"],
		["{(13)}", "ms-13 ms-cost ms-shadow", "13 Generic Mana", "{13}"],
		["{(14)}", "ms-14 ms-cost ms-shadow", "14 Generic Mana", "{14}"],
		["{(15)}", "ms-15 ms-cost ms-shadow", "15 Generic Mana", "{15}"],
		["{(16)}", "ms-16 ms-cost ms-shadow", "16 Generic Mana", "{16}"],
		["{(17)}", "ms-17 ms-cost ms-shadow", "17 Generic Mana", "{17}"],
		["{(18)}", "ms-18 ms-cost ms-shadow", "18 Generic Mana", "{18}"],
		["{(19)}", "ms-19 ms-cost ms-shadow", "19 Generic Mana", "{19}"],
		["{(20)}", "ms-20 ms-cost ms-shadow", "20 Generic Mana", "{20}"],
		[
			"{(Infinity|INFINITY|infinity|∞)}",
			"ms-infinity ms-cost ms-shadow",
			"Infinite Generic Mana",
			"{∞}"
		],
		["{(100)}", "ms-100 ms-cost ms-shadow", "100 Generic Mana", "{100}"],
		[
			"{(1,000,000|1000000)}",
			"ms-1000000 ms-cost ms-shadow",
			"1,000,000 Generic Mana",
			"{1,000,000}"
		],
		["\\[0\\]:", "ms-loyalty-zero ms-loyalty-0", "[0] Loyalty", "[0]", ":"],
		["\\[\\+X\\]:", "ms-loyalty-up ms-loyalty-x", "[+X] Loyalty", "[+X]", ":"],
		["\\[\\+1\\]:", "ms-loyalty-up ms-loyalty-1", "[+1] Loyalty", "[+1]", ":"],
		["\\[\\+2\\]:", "ms-loyalty-up ms-loyalty-2", "[+2] Loyalty", "[+2]", ":"],
		["\\[\\+3\\]:", "ms-loyalty-up ms-loyalty-3", "[+3] Loyalty", "[+3]", ":"],
		["\\[\\+4\\]:", "ms-loyalty-up ms-loyalty-4", "[+4] Loyalty", "[+4]", ":"],
		["\\[\\+5\\]:", "ms-loyalty-up ms-loyalty-5", "[+5] Loyalty", "[+5]", ":"],
		["\\[\\+6\\]:", "ms-loyalty-up ms-loyalty-6", "[+6] Loyalty", "[+6]", ":"],
		["\\[\\+7\\]:", "ms-loyalty-up ms-loyalty-7", "[+7] Loyalty", "[+7]", ":"],
		["\\[\\+8\\]:", "ms-loyalty-up ms-loyalty-8", "[+8] Loyalty", "[+8]", ":"],
		["\\[\\+9\\]:", "ms-loyalty-up ms-loyalty-9", "[+9] Loyalty", "[+9]", ":"],
		[
			"\\[\\+10\\]:",
			"ms-loyalty-up ms-loyalty-10",
			"[+10] Loyalty",
			"[+10]",
			":"
		],
		[
			"\\[\\+11\\]:",
			"ms-loyalty-up ms-loyalty-11",
			"[+11] Loyalty",
			"[+11]",
			":"
		],
		[
			"\\[\\+12\\]:",
			"ms-loyalty-up ms-loyalty-12",
			"[+12] Loyalty",
			"[+12]",
			":"
		],
		[
			"\\[\\+13\\]:",
			"ms-loyalty-up ms-loyalty-13",
			"[+13] Loyalty",
			"[+13]",
			":"
		],
		[
			"\\[\\+14\\]:",
			"ms-loyalty-up ms-loyalty-14",
			"[+14] Loyalty",
			"[+14]",
			":"
		],
		[
			"\\[\\+15\\]:",
			"ms-loyalty-up ms-loyalty-15",
			"[+15] Loyalty",
			"[+15]",
			":"
		],
		[
			"\\[\\+16\\]:",
			"ms-loyalty-up ms-loyalty-16",
			"[+16] Loyalty",
			"[+16]",
			":"
		],
		[
			"\\[\\+17\\]:",
			"ms-loyalty-up ms-loyalty-17",
			"[+17] Loyalty",
			"[+17]",
			":"
		],
		[
			"\\[\\+18\\]:",
			"ms-loyalty-up ms-loyalty-18",
			"[+18] Loyalty",
			"[+18]",
			":"
		],
		[
			"\\[\\+19\\]:",
			"ms-loyalty-up ms-loyalty-19",
			"[+19] Loyalty",
			"[+19]",
			":"
		],
		[
			"\\[\\+20\\]:",
			"ms-loyalty-up ms-loyalty-20",
			"[+20] Loyalty",
			"[+20]",
			":"
		],
		["\\[\\-X\\]:", "ms-loyalty-down ms-loyalty-x", "[-X] Loyalty", "[-X]", ":"],
		["\\[\\-1\\]:", "ms-loyalty-down ms-loyalty-1", "[-1] Loyalty", "[-1]", ":"],
		["\\[\\-2\\]:", "ms-loyalty-down ms-loyalty-2", "[-2] Loyalty", "[-2]", ":"],
		["\\[\\-3\\]:", "ms-loyalty-down ms-loyalty-3", "[-3] Loyalty", "[-3]", ":"],
		["\\[\\-4\\]:", "ms-loyalty-down ms-loyalty-4", "[-4] Loyalty", "[-4]", ":"],
		["\\[\\-5\\]:", "ms-loyalty-down ms-loyalty-5", "[-5] Loyalty", "[-5]", ":"],
		["\\[\\-6\\]:", "ms-loyalty-down ms-loyalty-6", "[-6] Loyalty", "[-6]", ":"],
		["\\[\\-7\\]:", "ms-loyalty-down ms-loyalty-7", "[-7] Loyalty", "[-7]", ":"],
		["\\[\\-8\\]:", "ms-loyalty-down ms-loyalty-8", "[-8] Loyalty", "[-8]", ":"],
		["\\[\\-9\\]:", "ms-loyalty-down ms-loyalty-9", "[-9] Loyalty", "[-9]", ":"],
		[
			"\\[\\-10\\]:",
			"ms-loyalty-down ms-loyalty-10",
			"[-10] Loyalty",
			"[-10]",
			":"
		],
		[
			"\\[\\-11\\]:",
			"ms-loyalty-down ms-loyalty-11",
			"[-11] Loyalty",
			"[-11]",
			":"
		],
		[
			"\\[\\-12\\]:",
			"ms-loyalty-down ms-loyalty-12",
			"[-12] Loyalty",
			"[-12]",
			":"
		],
		[
			"\\[\\-13\\]:",
			"ms-loyalty-down ms-loyalty-13",
			"[-13] Loyalty",
			"[-13]",
			":"
		],
		[
			"\\[\\-14\\]:",
			"ms-loyalty-down ms-loyalty-14",
			"[-14] Loyalty",
			"[-14]",
			":"
		],
		[
			"\\[\\-15\\]:",
			"ms-loyalty-down ms-loyalty-15",
			"[-15] Loyalty",
			"[-15]",
			":"
		],
		[
			"\\[\\-16\\]:",
			"ms-loyalty-down ms-loyalty-16",
			"[-16] Loyalty",
			"[-16]",
			":"
		],
		[
			"\\[\\-17\\]:",
			"ms-loyalty-down ms-loyalty-17",
			"[-17] Loyalty",
			"[-17]",
			":"
		],
		[
			"\\[\\-18\\]:",
			"ms-loyalty-down ms-loyalty-18",
			"[-18] Loyalty",
			"[-18]",
			":"
		],
		[
			"\\[\\-19\\]:",
			"ms-loyalty-down ms-loyalty-19",
			"[-19] Loyalty",
			"[-19]",
			":"
		],
		[
			"\\[\\-20\\]:",
			"ms-loyalty-down ms-loyalty-20",
			"[-20] Loyalty",
			"[-20]",
			":"
		],
		["\\[sX\\]", "ms-loyalty-start ms-loyalty-x", "Starting Loyalty X", "[sX]"],
		["\\[s0\\]", "ms-loyalty-start ms-loyalty-0", "Starting Loyalty 0", "[s0]"],
		["\\[s1\\]", "ms-loyalty-start ms-loyalty-1", "Starting Loyalty 1", "[s1]"],
		["\\[s2\\]", "ms-loyalty-start ms-loyalty-2", "Starting Loyalty 2", "[s2]"],
		["\\[s3\\]", "ms-loyalty-start ms-loyalty-3", "Starting Loyalty 3", "[s3]"],
		["\\[s4\\]", "ms-loyalty-start ms-loyalty-4", "Starting Loyalty 4", "[s4]"],
		["\\[s5\\]", "ms-loyalty-start ms-loyalty-5", "Starting Loyalty 5", "[s5]"],
		["\\[s6\\]", "ms-loyalty-start ms-loyalty-6", "Starting Loyalty 6", "[s6]"],
		["\\[s7\\]", "ms-loyalty-start ms-loyalty-7", "Starting Loyalty 7", "[s7]"],
		["\\[s8\\]", "ms-loyalty-start ms-loyalty-8", "Starting Loyalty 8", "[s8]"],
		["\\[s9\\]", "ms-loyalty-start ms-loyalty-9", "Starting Loyalty 9", "[s9]"],
		[
			"\\[s10\\]",
			"ms-loyalty-start ms-loyalty-10",
			"Starting Loyalty 10",
			"[s10]"
		],
		[
			"\\[s11\\]",
			"ms-loyalty-start ms-loyalty-11",
			"Starting Loyalty 11",
			"[s11]"
		],
		[
			"\\[s12\\]",
			"ms-loyalty-start ms-loyalty-12",
			"Starting Loyalty 12",
			"[s12]"
		],
		[
			"\\[s13\\]",
			"ms-loyalty-start ms-loyalty-13",
			"Starting Loyalty 13",
			"[s13]"
		],
		[
			"\\[s14\\]",
			"ms-loyalty-start ms-loyalty-14",
			"Starting Loyalty 14",
			"[s14]"
		],
		[
			"\\[s15\\]",
			"ms-loyalty-start ms-loyalty-15",
			"Starting Loyalty 15",
			"[s15]"
		],
		[
			"\\[s16\\]",
			"ms-loyalty-start ms-loyalty-16",
			"Starting Loyalty 16",
			"[s16]"
		],
		[
			"\\[s17\\]",
			"ms-loyalty-start ms-loyalty-17",
			"Starting Loyalty 17",
			"[s17]"
		],
		[
			"\\[s18\\]",
			"ms-loyalty-start ms-loyalty-18",
			"Starting Loyalty 18",
			"[s18]"
		],
		[
			"\\[s19\\]",
			"ms-loyalty-start ms-loyalty-19",
			"Starting Loyalty 19",
			"[s19]"
		],
		[
			"\\[s20\\]",
			"ms-loyalty-start ms-loyalty-20",
			"Starting Loyalty 20",
			"[s20]"
		],
		["\\[I\\](—|-)", "ms-saga ms-saga-1", "Chapter I", "[I]", "‒"],
		["\\[II\\](—|-)", "ms-saga ms-saga-2", "Chapter II", "[II]", "‒"],
		["\\[III\\](—|-)", "ms-saga ms-saga-3", "Chapter III", "[III]", "‒"],
		["\\[IV\\](—|-)", "ms-saga ms-saga-4", "Chapter IV", "[IV]", "‒"],
		["\\[V\\](—|-)", "ms-saga ms-saga-5", "Chapter V", "[V]", "‒"]
	];
	for (var i = 0; i < manaSymbols.length; i++) {
		var symb = manaSymbols[i][0];
		var re = new RegExp(symb, "g");
		var symbclass = manaSymbols[i][1];
		var symbtitle = manaSymbols[i][2];
		var symbalt = manaSymbols[i][3];
		var symbtrail;
		var symbtrailExists;
		if (manaSymbols[i][4] == undefined) {
			var symbtrail = "";
			var symbtrailExists = false;
		} else {
			var symbtrail = manaSymbols[i][4];
			var symbtrailExists = true;
		}
		if (symbtrailExists == false)
			var text = text.replace(
				re,
				"<i class='ms " +
					symbclass +
					"' title='" +
					symbtitle +
					"' alt='" +
					symbalt +
					"'><span class='mana-text'>" +
					symbalt +
					"</span></i>"
			);
		if (symbtrailExists)
			var text = text.replace(
				re,
				"<span style='display: inline-block;'><i class='ms " +
					symbclass +
					"' title='" +
					symbtitle +
					"' alt='" +
					symbalt +
					"'><span class='mana-text'>" +
					symbalt +
					"</span></i>" +
					symbtrail +
					"</span>"
			);
	}
	return text;
}

var collapsibles = document.getElementsByClassName("collapsible");
var i;
for (var i = 0; i < collapsibles.length; i++) {
	collapsibles[i].addEventListener("click", function () {
		var allActive = this.parentElement.querySelectorAll(".active");
		var actLength = allActive == null ? 0 : allActive.length;
		for (var j = 0; j < actLength; j++) {
			if (this.id !== allActive[j].id) {
				allActive[j].classList.remove("active");
				var content = allActive[j].nextElementSibling;
				if (content.style.maxHeight) {
					content.style.maxHeight = null;
				} else {
					content.style.maxHeight = content.scrollHeight + "px";
				}
			}
		}
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight) {
			content.style.maxHeight = null;
		} else {
			content.style.maxHeight = content.scrollHeight + "px";
		}
		setTimeout(() => this.scrollIntoViewIfNeeded(true), 300);
	});
}

function removeAllListeners(old_element) {
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function getNRandoms(max, n) {
	if (n > max) {
		throw new Error(
			"The max number must not be less than the number of requested numbers."
		);
	}
	var nums = [];
	var randoms = [];
	for (var i = 0; i < max; i++) {
		nums.push(i);
	}
	for (var i = 0; i < n; i++) {
		var rand = getRandomInt(nums.length);
		var numToPush = nums[rand];
		randoms.push(numToPush);
		var nums = nums.filter((item) => item !== numToPush);
	}
	return randoms;
}

function unfocus(returnEl) {
	if (!returnEl) var returnEl = document.activeElement;
	var tmp = document.createElement("input");
	returnEl.parentNode.insertBefore(returnEl, returnEl.nextSibling);
	tmp.focus();
	tmp.remove();
	returnEl.scrollIntoViewIfNeeded(true);
}

function deselectify() {
	var oldSelAr = document.getElementsByClassName("selected");
	if (oldSelAr.length > 0) {
		for (var i = 0; i < oldSelAr.length; i++) {
			var oldSel = oldSelAr[i];
			oldSel.classList.add("grow-slight");
			oldSel.classList.remove("selected", "grow-over-selected");
		}
	}
}

function onCardClick(el, isFor) {
	if (el.classList.contains("selected") === false) {
		deselectify();
		el.classList.remove("grow-slight");
		el.classList.add("selected", "grow-over-selected");
	} else {
		deselectify();
		document.getElementById("typeSelMain").classList.remove("off");
		if (isFor === "dav") {
			var currentDisp = document.getElementById("davCurrentDisp");
			var allDisp = document.getElementById("davAllDisp");
			currentDisp.innerHTML +=
				"<p>" + el.getElementsByClassName("dav-card-text")[0].innerHTML + "</p>";
			allDisp.innerHTML +=
				"<p class='" +
				classifyCL(el.getElementsByClassName("dav-card-text")[0].innerHTML) +
				"'>" +
				el.getElementsByClassName("dav-card-text")[0].innerHTML +
				"</p>";
			document.getElementById("davCurrentBtn").classList.remove("off");
			transitionCards(false);
			updateEmblems();
		} else if (isFor === "draft") {
			var json = el.cardjson;
			var dfc = el.dfc;
			var cardDisp = document.getElementById("draftCardDisp");
			var disp = document.getElementById("draftHistoryInner");
			var dfcbtn = "";
			if (dfc) {
				var name = json.card_faces[0].name;
				var img = json.card_faces[0].image_uris.normal;
				var img2 = json.card_faces[1].image_uris.normal;
			} else {
				var name = json.name;
				var img = json.image_uris.normal;
			}
			var newEl = document.createElement("p");
			newEl.classList.add("tooltip-base", "draft-disp-p");
			var newElA = document.createElement("a");
			newElA.href = json.scryfall_uri;
			newElA.classList.add("link", "draft");
			newElA.target = "_blank";
			newElA.rel = "noopener noreferrer";
			newElA.innerHTML = name;
			newEl.appendChild(newElA);
			var newElImg = document.createElement("img");
			newElImg.src = img;
			newElImg.classList.add("draft-img", "tooltip-follow", "center-x");
			newEl.appendChild(newElImg);
			if (dfc) {
				var newElImg2 = document.createElement("img");
				newElImg2.classList.add(
					"draft-img",
					"tooltip-follow",
					"center-x",
					"hidden"
				);
				newElImg2.src = img2;
				newEl.appendChild(newElImg2);
				var newElBtn = document.createElement("button");
				newElBtn.classList.add("draft-dfc");
				newElBtn.addEventListener("click", function (e) {
					e.stopPropagation();
					var siblings = this.parentElement.querySelectorAll("img");
					for (var i = 0; i < siblings.length; i++) {
						siblings[i].classList.toggle("hidden");
					}
				});
				newEl.appendChild(newElBtn);
			}
			disp.appendChild(newEl);
			disp.appendChild(document.createElement("p"));
			document.getElementById("draftHistoryColl").classList.remove("off");
			if (disp.parentElement.style.maxHeight) {
				disp.parentElement.style.maxHeight = disp.parentElement.scrollHeight + "px";
			}
			document.getElementById("draftSettings").classList.remove("off");
			document.getElementById("draftBtn").classList.remove("off");
			document.getElementById("draftInput").classList.remove("off");
			cardDisp.style.opacity = "0%";
			cardDisp.style.visibility = "hidden";
			setTimeout(() => {
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
				cardDisp.innerHTML = "";
			}, 500);
		}
	}
}

function runDavList(list, display) {
	var cards = document.getElementsByClassName("dav-card");
	var headers = document.getElementsByClassName("dav-card-header");
	var texts = document.getElementsByClassName("dav-card-text");
	var reptNum = cards.length;
	var nums = getNRandoms(list.length, reptNum);
	if (custom === true) var display = "Custom " + display;
	for (var i = 0; i < reptNum; i++) {
		cards[i].addEventListener("click", function () {
			onCardClick(this, "dav");
		});
		headers[i].innerHTML = display + " " + (i + 1);
		texts[i].innerHTML = list[nums[i]];
	}
	updateCurrent();
	transitionCards(true);
	document.getElementById("davSettings").classList.add("off");
}

function transitionCards(tfBool) {
	var cardSub = document.getElementById("cardSub");
	if (tfBool) {
		cardSub.style.opacity = "100%";
		cardSub.style.visibility = "visible";
		setTimeout(() => cardSub.scrollIntoViewIfNeeded(true), 300);
	} else {
		cardSub.style.opacity = "0%";
		cardSub.style.visibility = "hidden";
		var cards = document.getElementsByClassName("dav-card");
		for (var i = 0; i < cards.length; i++) {
			removeAllListeners(cards[i]);
		}
	}
}

function runDav() {
	this.classList.add("off");
	var currentDisp = document.getElementById("davCurrentDisp");
	currentDisp.innerHTML = "";
	currentDisp.removeEventListener("DOMSubtreeModified", davCardProgress);
	currentDisp.removeEventListener("DOMSubtreeModified", davCardFinish);
	currentDisp.addEventListener("DOMSubtreeModified", davCardProgress);
	runDavList(offers, "Offer");
	if (!firstDav) firstDav = true;
	else document.getElementById("davAllDisp").innerHTML += "<hr class='middle'>";
}

function updateCurrent(isFor) {
	var currentBtn = document.getElementById("davCurrentBtn");
	var allActive = document.querySelectorAll(".active");
	var actLength = allActive == null ? 0 : allActive.length;
	for (var j = 0; j < actLength; j++) {
		if (currentBtn.id !== allActive[j].id) {
			allActive[j].classList.remove("active");
			var content = allActive[j].nextElementSibling;
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + "px";
			}
		}
	}
	currentBtn.classList.add("active");
	var content = currentBtn.nextElementSibling;
	content.style.maxHeight = content.scrollHeight + "px";
}

function davCardProgress() {
	this.removeEventListener("DOMSubtreeModified", davCardProgress);
	this.addEventListener("DOMSubtreeModified", davCardFinish);
	setTimeout(() => runDavList(conditions, "Condition"), 666);
}

function davCardFinish() {
	this.removeEventListener("DOMSubtreeModified", davCardFinish);
	setTimeout(() => updateCurrent(), 200);
	setTimeout(
		() =>
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			}),
		666
	);
	document.getElementById("runDav").classList.remove("off");
	document.getElementById("davAllBtn").classList.remove("off");
	document.getElementById("davSettings").classList.remove("off");
}

function updateEmblems() {
	var emblemDisp = document.getElementById("davEmblemDisp");
	var allDisp = document.getElementById("davAllDisp");
	if (
		offersRaw.replace(/\r?\n/g, "\n") !==
			"Draw three cards.\nConjure a Manor Guardian card into your hand.\nReturn two random creature cards from your graveyard to your hand. They perpetually get +1/+1.\nReturn a random creature card with the highest mana value from among cards in your graveyard to the battlefield.\nYou get an emblem with “Creatures you control get +2/+0.”\nYou get an emblem with “Spells you cast cost {B} less to cast.”\nYou get an emblem with “Davriel planeswalkers you control have '[+2]: Draw a card.'”\nYou get an emblem with “Whenever you draw a card, you gain 2 life.”" ||
		conditionsRaw.replace(/\r?\n/g, "\n") !==
			"You lose 6 life.\nExile two cards from your hand. If fewer than two cards were exiled this way, each opponent draws cards equal to the difference.\nSacrifice two permanents.\nEach creature you don't control perpetually gains +1/+1.\nYou get an emblem with “Creatures you control get -1/-0.”\nYou get an emblem with “Spells you cast cost {B} more to cast.”\nYou get an emblem with “Whenever you draw a card, exile the top two cards of your library.”\nYou get an emblem with “At the beginning of your upkeep, you lose 1 life for each creature you control.”"
	) {
		if (custom === false) {
			emblemDisp.innerHTML =
				"<p>Davriel's contracts have been updated, but the emblem tracker has not been. Contact @tmbocheeko_ on Twitter to have this be fixed.</p>";
			if (emblemErr === false) {
				emblemErr = true;
				throw new Error(
					"Davriel's contracts have been updated, but the emblem tracker has not been. Contact @tmbocheeko_ on Twitter to have this be fixed."
				);
			} else return;
		} else if (custom === true) {
			emblemDisp.innerHTML =
				"<p>The emblem tracker is not supported for custom contracts.</p>";
			return;
		}
	}
	emblemDisp.innerHTML = "";

	// At the beginning of your upkeep, you lose X life for each creature you control. | X is a number.
	var creatureNeg = document.querySelectorAll("." + classifyQSA(conditions[7]))
		.length;
	if (creatureNeg !== 0) {
		emblemDisp.innerHTML +=
			"<p>At the beginning of your upkeep, you lose " +
			creatureNeg +
			" life for each creature you control.</p>";
	}

	// Whenever you draw a card, exile the top X cards of your library. | X is a number word; X is twice the number of occurrences.
	var drawNeg = document.querySelectorAll("." + classifyQSA(conditions[6]))
		.length;
	if (drawNeg !== 0) {
		var drawNegStr = toWords(2 * drawNeg);
		emblemDisp.innerHTML +=
			"<p>Whenever you draw a card, exile the top " +
			drawNegStr +
			" cards of your library.</p>";
	}

	// Whenever you draw a card, you gain X life. | X is a number; X is twice the number of occurrences.
	var drawPos = document.querySelectorAll("." + classifyQSA(offers[7])).length;
	if (drawPos !== 0) {
		var drawPosTot = 2 * drawPos;
		emblemDisp.innerHTML +=
			"<p>Whenever you draw a card, you gain " + drawPosTot + " life.</p>";
	}

	// Spells you cast cost X({B}) [more/less] to cast. | X is a number word if X is greater than 5. If it is less than 5, there are X {B} symbols.
	var costPos = document.querySelectorAll("." + classifyQSA(offers[5])).length;
	var costNeg = document.querySelectorAll("." + classifyQSA(conditions[5]))
		.length;
	var costTot = costPos - costNeg;
	var manaB = manafontify("{B}");
	if (costTot !== 0) {
		var costWord;
		if (costTot > 0) var costWord = "less";
		if (costTot < 0) var costWord = "more";
		if (Math.abs(costTot) > 5) {
			var costTotStr = toWords(Math.abs(costTot));
			emblemDisp.innerHTML +=
				"<p>Spells you cast cost " +
				costTotStr +
				" " +
				manaB +
				" " +
				costWord +
				" to cast.</p>";
		} else {
			var costSymb = "";
			for (var i = 0; i < Math.abs(costTot); i++) {
				var costSymb = costSymb + manaB;
			}
			emblemDisp.innerHTML +=
				"<p>Spells you cast cost " + costSymb + " " + costWord + " to cast.</p>";
		}
	}

	// Creatures you control get ±X/±0. | X is a number; X is twice the number of positive occurrences minus the number of negative occurrences.
	var anthemPos = document.querySelectorAll("." + classifyQSA(offers[4])).length;
	var anthemNeg = document.querySelectorAll("." + classifyQSA(conditions[4]))
		.length;
	var anthemTot = 2 * anthemPos - anthemNeg;
	if (anthemTot !== 0) {
		var anthemSymb;
		if (anthemTot > 0) var anthemSymb = "+";
		if (anthemTot < 0) var anthemSymb = "-";
		emblemDisp.innerHTML +=
			"<p>Creatures you control get " +
			anthemSymb +
			Math.abs(anthemTot) +
			"/" +
			anthemSymb +
			"0.</p>";
	}

	// Davriel planeswalkers you control have “[+2]: Draw a card.” | There is no X.
	var davrielPos = document.querySelectorAll("." + classifyQSA(offers[[6]]))
		.length;
	if (davrielPos !== 0) {
		emblemDisp.innerHTML +=
			"<p>" +
			manafontify("Davriel planeswalkers you control have “[+2]: Draw a card.”") +
			"</p>";
	}

	// Make it not empty lmao
	if (emblemDisp.innerHTML == "")
		emblemDisp.innerHTML = "<p>You currently have no emblems.</p>";
}

function classifyQSA(str) {
	var bad = [
		"\\",
		"~",
		"!",
		"@",
		"$",
		"%",
		"^",
		"&",
		"*",
		"(",
		")",
		"+",
		"=",
		",",
		".",
		"/",
		";",
		":",
		"?",
		">",
		"<",
		"[",
		"]",
		"{",
		"}",
		"|",
		"#"
	];
	var worse = ["`", "'", '"'];
	var strfixed = str.replace(/<i.*?>.*?<\/i>/g, "");
	for (var i = 0; i < bad.length; i++) {
		var exp = "\\" + bad[i];
		var re = new RegExp(exp, "g");
		var strfixed = strfixed.replace(re, exp);
	}
	for (var i = 0; i < worse.length; i++) {
		var exp = "\\" + worse[i];
		var re = new RegExp(exp, "g");
		var strfixed = strfixed.replace(re, "");
	}
	var strfixed = strfixed.replace(/\s+/g, "-");
	return strfixed;
}

function classifyCL(str) {
	var strfixed = str;
	var worse = ["`", "'", '"'];
	for (var i = 0; i < worse.length; i++) {
		var exp = "\\" + worse[i];
		var re = new RegExp(exp, "g");
		var strfixed = strfixed.replace(re, "");
	}
	var strfixed = strfixed.replace(/<i.*?>.*?<\/i>/g, "").replace(/\s+/g, "-");
	return strfixed;
}

function classifyVar(str) {
	var bad = [
		"\\",
		"~",
		"!",
		"@",
		"$",
		"%",
		"^",
		"&",
		"*",
		"(",
		")",
		"+",
		"=",
		",",
		".",
		"/",
		";",
		":",
		"?",
		">",
		"<",
		"[",
		"]",
		"{",
		"}",
		"|",
		"#"
	];
	var worse = ["`", "'", '"'];
	var strfixed = str.replace(/<i.*?>.*?<\/i>/g, "");
	for (var i = 0; i < bad.length; i++) {
		var exp = "\\" + bad[i];
		var re = new RegExp(exp, "g");
		var strfixed = strfixed.replace(re, exp);
	}
	for (var i = 0; i < worse.length; i++) {
		var exp = "\\" + worse[i];
		var re = new RegExp(exp, "g");
		var strfixed = strfixed.replace(re, "");
	}
	var strfixed = strfixed.replace(/\s+/g, "");
	return strfixed;
}

document.getElementById("draftBtn").addEventListener("click", spellbooklog);

async function spellbooklog() {
	var input = document.getElementById("draftInput");
	var sbfor = input.value;
	var dropdown = input.nextElementSibling.children[0].children;
	var isGood = false;
	for (var i = 0; i < dropdown.length; i++) {
		if (dropdown[i].innerHTML === sbfor) {
			var isGood = true;
			var sbforInDropdown = dropdown[i];
			break;
		}
	}
	if (!isGood) return false;
	if (sbforInDropdown.custom) {
		var query = "?q=" + encodeURIComponent(sbforInDropdown.custom);
	} else {
		var sbfor = sbfor.replace(/[!'()*]/g, "");
		this.classList.add("off");
		input.classList.add("off");
		document.getElementById("typeSelMain").classList.add("off");
		document.getElementById("draftSettings").classList.add("off");
		var addtext = "";
		if (sbfor.toLowerCase() === "key to the archive") var addtext = " set:sta";
		var query =
			"?q=" +
			encodeURIComponent("spellbook:'" + sbfor + "' unique:cards" + addtext);
	}
	var json = await fetchJSON("https://api.scryfall.com/cards/search" + query);
	document.getElementById("draftCardDisp").innerHTML = ""; //
	var nums = getNRandoms(json.data.length, 3);
	draftCards("draft", nums, json);
}

function draftCards(isFor, nums, json) {
	for (var i = 0; i < nums.length; i++) {
		var newEl = document.createElement("div");
		newEl.classList.add(isFor + "-card", "grow-slight", isFor);
		newEl.addEventListener("click", function () {
			onCardClick(this, isFor);
		});
		newEl.cardjson = json.data[nums[i]];
		if (json.data[nums[i]].image_uris) {
			var newElInner = document.createElement("img");
			newElInner.src = json.data[nums[i]].image_uris.normal;
			newElInner.classList.add(isFor + "-img");
			newEl.appendChild(newElInner);
			newEl.dfc = false;
		} else {
			var newElBtn = document.createElement("button");
			newElBtn.classList.add(isFor + "-dfc");
			newElBtn.addEventListener("click", function (e) {
				e.stopPropagation();
				var siblings = this.parentElement.querySelectorAll("img");
				for (var i = 0; i < siblings.length; i++) {
					siblings[i].classList.toggle("hidden");
				}
			});
			newEl.appendChild(newElBtn);
			var newElInner1 = document.createElement("img");
			newElInner1.src = json.data[nums[i]].card_faces[0].image_uris.normal;
			newElInner1.classList.add(isFor + "-img");
			newEl.appendChild(newElInner1);
			var newElInner2 = document.createElement("img");
			newElInner2.src = json.data[nums[i]].card_faces[1].image_uris.normal;
			newElInner2.classList.add(isFor + "-img", "hidden");
			newEl.appendChild(newElInner2);
			newEl.dfc = true;
		}
		if (isFor === "draft") var disp = document.getElementById("draftCardDisp");
		disp.appendChild(newEl);
	}
	disp.style.opacity = "100%";
	disp.style.visibility = "visible";
	setTimeout(() => {
		disp.scrollIntoView({
			behavior: "smooth"
		});
	}, 300);
}

if ("scrollRestoration" in window.history) {
	window.history.scrollRestoration = "manual";
}
