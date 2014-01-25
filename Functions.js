/**
* Fichiers de fonctions communes utilisées par les outils de seo
*
* @package Niouseo
* @subpackage NiouseoFunctions
* @author reservoir34
* @copyright Mikaél DELSOL
* @version 1.0 
*/
var DEBUG = typeof DEBUG != 'undefined' ? DEBUG : false;
debug = location.hostname == 'niouseo';
/**
 * Fonction simialire à celle de php, permet de définir des "CONSTANTES" associée à leur valeur
 *
 * @param $_constantName string le nom de la constante à déclarer
 * @param $_constantValue mixed la valeur de la constante
 * @return bool true
 */
function define(/*string*/$_constantName,/*mixed*/$_constantValue)
{
	try
	{
		if (!isset(eval($_constantName)))
			eval($_constantName + ' ="' + $_constantValue + '";');
		else
			return !displayDebug('define', 'la contante "' + $_constantName + '" existe déjé avec la valeur "' + eval($_constantName) + '"', true);
	}
	catch (e)
	{
		/**
		 * Si exception générée alors c'est que la variable n'existe pas déjé
		 */
		eval($_constantName + ' = "' + $_constantValue + '";');
	}
	return displayDebug('define', 'Définition de la constante "' + $_constantName + '" avec la valeur "' + $_constantValue + '" réalisé avec succés');
}
/**
 * Fonction permettant de tester si une valeur est présente dans un tableau de valeurs
 *
 * @uses isArray
 * @uses isObject
 * @param $_value string la valeur recherchée
 * @param $_array array le tableau de valeurs
 * @return bool true si la valeur est présente|false si la valeur n'est pas présente ou que 
 */
function inArray(/*mixed*/$_value,/*array/object*/$_array)
{
	displayDebug({ 'function' : 'inArray' }, { 'value' : $_value }, { 'array' : $_array });
	if ((!isArray($_array) && !isObject($_array)) || ((isArray($_array) || isObject($_array)) && count($_array) == 0))
		return false;
	var present = false;
	var len = $_array.length;
	for ( var i = 0; (i < len) && !present; i++)
		present = present || ($_array[i] == $_value);
	return present;
}
/**
 * Fonction permettant de teser si une clef existe  pour une valeur dans le tableau
 *
 * @uses isArray
 * @uses isObject
 * @uses count
 * @param $_key string le clef recherchée
 * @param $_array array le tableau
 * @return bool true|false
 */
function keyInArray(/*string*/$_key,/*array/object*/$_array)
{
	displayDebug({ 'function' : 'keyInArray' }, { 'key' : $_key }, { 'array' : $_array });
	if ((!isArray($_array) && !isObject($_array)) || ((isArray($_array) || isObject($_array)) && count($_array) == 0))
		return false;
	for ( var key in $_array)
	{
		if (key == $_key)
			return true;
	}
	return false;
}
/**
 * Fonction permettant d'ajouter une valeur à un tableau (la valeur est ajouté au tableau par référence)
 * @param $_array array le tableau
 * @param $_value mixed la valeur
 * @param $_index int|string l'index auquel la valeur doit étre enregistrée
 * @return array le tableau avec la nouvelle valeur
 */
function addValueToArray($_array, $_value, $_index)
{
	if (!isArray($_array))
		$_array = new Array();
	if (isset($_index))
		$_array[$_index] = $_value;
	else
		$_array[count($_array)] = $_value;
	return $_array;
}
/**
 * Fonction permettant de supprimer une valeur d'un tableau
 * @param $_value mixed la valeur à supprimer
 * @param $_array array le tableau duquel il faut supprimer la valeur
 * @return array le tableau sans la valeur
 */
function removeValueOfArray($_value, $_array)
{
	var newArray = new Array();
	if (isArray($_array) && inArray($_value, $_array))
	{
		for ( var index in $_array)
			if ($_array[index] !== $_value)
				newArray[index] = $_array[index];
		return newArray;
	}
	else
		return $_array;
}
/**
 * Fonction permettant de supprimer un élément du tableau par son index
 * @param $_index mixed l'index
 * @param $_array array le tableau duquel il faut surpprimer la valeur par l'index
 * @return array le tableau sans la valeur
 */
function removeElementOfArrayByIndex($_index, $_array)
{
	var newArray = new Array();
	if (isArray($_array) && keyInArray($_index, $_array))
	{
		for ( var index in $_array)
			if (index !== $_index)
				newArray[index] = $_array[index];
		return newArray;
	}
	else
		return $_array;
}
/**
 * Fonction permettant de compter le nombre d'attribut contenu par un tableau ou un objet Javascript
 *
 * @uses isArray (utilisant isObject, inutile de faire appel à isObject)
 * @param $_array mixed le tableau ou l'objet ou autre chose dont il faut calculer le nombre d'attributs
 * @return int le nombre d'attributs
 */
function count(/*mixed*/$_array)
{
	displayDebug('count', { 'array' : $_array });
	var counter = 0;
	if (isset($_array) && (isArray($_array) || isObject($_array)))
	{
		for ( var indice in $_array)
			counter++;
	}
	else
	{
		if (isset($_array))
			counter = 1;
		else
			counter = 0;
	}
	return counter;
}
/**
 * Fonction permettant de récupérer la valeur d'un champ de formulaire que ce soit une liste de sélection, un champ test ou testarea.
 * Pour cela, lui passer l'id de l'élément du formulaire. 
 * Pour le moment, elle contient les éléments de base d'un formulare, à faire évoluer si nécessaire
 *
 * @param $_id string l'id de l'élément HTML du formulaire
 * @return la valeur du champ du formulaire ou null si le champ n'a pas été trouvé
 */
function getFieldValue(/*string*/$_id/*,$_el*/)
{
	displayDebug('getFieldValue', $_id);
	if (isset(arguments[1]))
		var el = DOM.get(arguments[1]);
	else
		var el = DOM.get($_id);
	if (isset(el))
	{
		switch (el.tagName.toUpperCase())
		{
			case 'TEXTAREA':
				displayDebug('getFieldValue', el.value);
				return el.value;
				break;
			case 'IMG':
				displayDebug('getFieldValue : IMG', el.src, false);
				return el.src;
				break;
			case 'INPUT':
				switch (el.type.toUpperCase())
				{
					case 'SUBMIT':
					case 'TEXT':
					case 'PASSWORD':
					case 'HIDDEN':
					case 'RADIO':
					case 'FILE':
						displayDebug('getFieldValue', el.value);
						return el.value;
						break;
					case 'CHECKBOX':
						displayDebug('getFieldValue', el.checked);
						return ((el.checked == 'on' || el.checked) ? 1 : 0);
						break;
					case 'IMAGE':
						displayDebug('getFieldValue', el.src);
						return el.src;
						break;
				}
				break;
			case 'SELECT':
				displayDebug('getFieldValue', el.options[el.selectedIndex].value);
				return el.options[el.selectedIndex].value;
				break;
			case 'A':
				displayDebug('getFieldValue', el.href);
				return el.href;
				break;
			default:
				displayDebug('getFieldValue', el.innerHTML);
				return el.innerHTML;
				break;
		}
	}
	else
		return null;
}
/**
 * Fonction permettant de définir la valeur d'un élément HTML
 *
 * @param $_id string|HTMLElement l'id de l'élément HTML|l'élément HTML
 * @param $_value la valeur de l'élément
 * @return la valeur du champ du formulaire ou null si le champ n'a pas été trouvé
 */
function setFieldValue(/*string*/$_id,/*HTMLElement*/$_value)
{
	displayDebug('setFieldValue', Array($_id, $_value), false);
	if (DOM.get($_id))
		var el = DOM.get($_id);
	if (isset(el))
	{
		switch (el.tagName)
		{
			case 'TEXTAREA':
				el.value = $_value;
				var error = false;
				try
				{
					el.innerHTML = $_value;
				}
				catch (e)
				{
					error = true;
					displayDebug('setFieldValue : TEXTAREA', e, true);
				}
				if (error)
				{
					try
					{
						el.innerText = $_value;
					}
					catch (e)
					{
						displayDebug('setFieldValue : TEXTAREA', e, true);
					}
				}
				displayDebug('setFieldValue : TEXTAREA', el.innerHTML, false);
				return el.value;
				break;
			case 'IMG':
				el.src = $_value;
				el.setAttribute('src', $_value);
				displayDebug('setFieldValue : IMG', el.src, false);
				return el.src;
				break;
			case 'INPUT':
				switch (el.type)
				{
					case 'text':
					case 'TEXT':
					case 'PASSWORD':
					case 'password':
					case 'HIDDEN':
					case 'hidden':
					case 'RADIO':
					case 'radio':
					case 'FILE':
					case 'file':
						el.value = $_value;
						el.setAttribute('value', $_value);
						displayDebug('setFieldValue : INPUT', el.value, false);
						return el.value;
						break;
					case 'CHECKBOX':
					case 'checkbox':
						if ($_value)
						{
							el.setAttribute('checked', 'checked');
							el.checked = true;
						}
						else
						{
							el.removeAttribute('checked');
							el.checked = false;
						}
						displayDebug('setFieldValue : INPUT', el.checked, false);
						return ((el.checked == 'on' || el.checked) ? 1 : 0);
						break;
					case 'IMAGE':
					case 'image':
						el.src = $_value;
						displayDebug('setFieldValue : INPUT', el.src, false);
						return el.src;
						break;
					default:
						el.innerHTML = $_value;
						displayDebug('setFieldValue : default', el.innerHTML, true);
						return el.innerHTML;
						break;
				}
				break;
			case 'SELECT':
				var options = el.options;
				var nbOptions = options.length;
				for ( var index = 0; index < nbOptions; index++)
				{
					if (options[index].value == $_value)
					{
						el.selectedIndex = index;
						options[index].setAttribute('selected', 'selected');
					}
					else
						options[index].removeAttribute('selected');
				}
				displayDebug('setFieldValue : SELECT', el.options[el.selectedIndex].value, false);
				return el.options[el.selectedIndex].value;
				break;
			default:
				var error = false;
				try
				{
					el.innerHTML = $_value;
				}
				catch (e)
				{
					error = true;
					displayDebug('setFieldValue : default', e, true);
				}
				if (error)
				{
					try
					{
						el.innerText = $_value;
					}
					catch (e)
					{
						displayDebug('setFieldValue : default', e, true);
					}
				}
				displayDebug('setFieldValue : default', el.innerHTML, true);
				return el.innerHTML;
				break;
		}
	}
	else
		return null;
}
/**
 * Fonction permettant de tester qu'une variable est définie ou non
 *
 * @param $_var mixed la variable à tester
 * @return bool false si $_var vaut undefined ou null
 */
function isset(/*mixed*/$_var)
{
	//displayDebug({'function':'isset'},{'var':$_var});
	return ((typeof $_var != 'undefined') && ($_var != null) && ($_var != undefined));
}
/**
 * Fonction permettant de tester si une valeur est vraie ou non
 *
 * @uses isset
 * @param $_var mixed la valeur à tester
 * @return bool
 */
function isTrue(/*mixed*/$_var)
{
	//displayDebug({'function':'isTrue'},{'var':$_var});
	if (!isset($_var))
		return false;
	else
		return ($_var == true || $_var == "true" || $_var == "on" || $_var == 1 || $_var == "1" || $_var == "vrai");
}
/**
 * Fonction permettant de tester si une valeur est fausse ou non
 *
 * @uses isTrue
 * @param $_var mixed la valeur à tester
 * @return bool
 */
function isFalse(/*mixed*/$_var)
{
	//displayDebug({'function':'isFalse'},{'var':$_var});
	return !isTrue($_var);
}
/**
 * Méthode permettant de tester si l'attribut est bien un tableau
 *
 * @uses isObject
 * @param $_array array le tableau à vérifeir
 * @return bool true si c'est un tableau
 */
function isArray(/*array*/$_array)
{
	//displayDebug({'function':'isArray'},{'array':$_array});
	return (isset($_array) && isObject($_array) && $_array.constructor == Array);
}
/**
 * Méthode permettant de tester si l'attribut est bien un objet
 *
 * @uses isFunction
 * @param $_object object l'objet à vérifier
 * @return bool true si c'est un objet
 */
function isObject(/*object*/$_object)
{
	//displayDebug({'function':'isObject'},{'object':$_object});
	return (isset($_object) && typeof $_object == 'object');
}
/**
 * Méthode permettant de savooir si un objet contient la propriété indiquée
 * @param $_object object
 * @param $_property string le nom de la propriété
 * @return bool true|false
 */
function hasProperty($_object, $_property)
{
	try
	{
		return keyInArray($_property, $_object);
	}
	catch (e)
	{
		return false;
	}
}
/**
 * Méthode permettant de tester si l'attribut est bien une fonction
 *
 * @param $_function function la fonction à vérifier
 * @return bool true si c'est une fonction
 */
function isFunction(/*function*/$_function)
{
	//displayDebug({'function':'isFunction'},{'function':$_function});
	return (isset($_function) && typeof $_function == 'function');
}
/**
 * Méthode retournant true si la valeur passée en paramétre est bien une chaine de caractére
 * @param $_string string
 * @return bool true si c'est une chaine de caractére|false dans le cas contraire
 */
function isString($_string)
{
	return (isset($_string) && typeof $_string == 'string');
}
/**
 * Méthode retournatn true si al valeur passée en paramétre est bien un booléen
 * @param $_bool boolean
 * @return bool true si c'est un booléen
 */
function isBool($_bool)
{
	return (isset($_bool) && typeof $_bool == "boolean");
}
/**
 * Méthode de récupération de l'élément HTML à la source de l'événement généré compatible Mozilla/IE
 *
 * @param $_event event l'événement
 * @return HTMLElement l'élément HTML à l'origine de l'événement 
 */
function getEventSource($_event)
{
	displayDebug({ 'function' : 'getEventSource' }, { 'event' : $_event });
	return (document.all && !$_event.target) ? event.srcElement : $_event.target;
}
/**
 * Méthode d'échappement des ' et // pour construire une chaine de caractére correcte à partir d'un objet JSON
 *
 * @param $_textToSlash string/mixed la chaine de caratéres à échapper
 * @return string la chaine échappée
 */
function addSlashes(/*string*/$_textToSlash)
{
	displayDebug({ 'function' : 'addSlashes' }, { 'textToSlash' : $_textToSlash });
	var rg = new RegExp("(//)");
	$_textToSlash = new String($_textToSlash);
	displayDebug({ 'function' : 'addSlashes' }, { '$_textToSlash' : $_textToSlash }, { '$_textToSlash.replace(rg,"\\/\\/")' : $_textToSlash.replace(rg, "\\/\\/") });
	return $_textToSlash.replace(rg, "\\/\\/");
}
/**
 * Fonction permettant à partir d'une url complére de récupérer le nom de domaine dans les paramétres supplémentaire
 * Utilisé avant de récupérer le pagerank du site par rapport à son url
 *
 * @param $_url string l'url (in)compléte du site
 * @return string l'url simplifiée du site 
 */
function getSimpleUrlFromUrl($_url)
{
	displayDebug({ 'function' : 'getSimpleUrlFromUrl' }, { 'url' : $_url });
	var reg = new RegExp("(http://[w\\.]*[a-zA-Z0-9\\-_.]+)[\\/]*", "g");
	var result = reg.exec($_url);
	displayDebug({ 'function' : 'getSimpleUrlFromUrl' }, { 'result[0]' : result[0] });
	return result[0];
}
/**
 * Méthode permettant de vérifier que deux chaines de caractéres sont identiques
 * @param $_s string la premiére chaine
 * @param $_r string la deuxiéme chaine
 * @return bool true|false
 */
function theSameString($_s, $_r)
{
	return (isString($_s) && ($_s === $_r));
}
/**
 * Fonction permettant d'afficher des messages de debug à partir du moment ou DEBUG est à true
 *
 * @uses isTrue
 * @uses isset
 * @param autant de valeurs que voulues
 * @return bool true 
 */
function displayDebug(/*[$_param[,$_param[,...]]]*/)
{
	if (isTrue(DEBUG) && isset(console))
	{
		var mess = "";
		var ind = 0;
		lineDisplayDebug = typeof lineDisplayDebug != 'undefined' ? lineDisplayDebug : 0;
		/**
		 * Variable permettant de récupérer les paramétres passés à la fonction
		 * @var array
		 */
		displayDebugArguments = typeof displayDebugArguments == 'undefined' ? new Array() : displayDebugArguments;
		displayDebugArguments[lineDisplayDebug] = typeof displayDebugArguments[lineDisplayDebug] == 'undefined' ? new Array() : displayDebugArguments[lineDisplayDebug];
		while (isset(arguments[ind]))
		{
			if (!isObject(arguments[ind]))
				mess += (mess == "" ? "" : ", ") + ind + " : " + arguments[ind];
			else
			{
				for ( var attr in arguments[ind])
					mess += (mess == "" ? "" : ", ") + attr + "=>" + arguments[ind][attr];
			}
			displayDebugArguments[lineDisplayDebug].push(arguments[ind]);
			ind++;
		}
		if (isset(document.getElementById('console')))
			document.getElementById('console').innerHTML = "\n<br>&nbsp;" + lineDisplayDebug + ' | Message de displayDebug : ' + mess + document.getElementById('console').innerHTML;
		/**
		 * SI le dernier paramétre est un booléen à faux, on affiche le message comme un message d'erreur
		 */
		if (typeof arguments[ind - 1] == "boolean" && isTrue(arguments[ind - 1]))
			console.error('Message de displayDebug : ' + mess);
		else
			console.info('Message de displayDebug : ' + mess);
		lineDisplayDebug = parseInt(lineDisplayDebug + 1);
	}
	return true;
}
/**
 * Fonction permettant simplement de récupérer une chaine de caractére avec la premiére lettre en majuscule
 *
 * @param $_name string la chaine de caractéres
 * @return la chaine de caractéres avec la premiére lettre en masjuscule
 */
function getCamelCaseForm($_name)
{
	displayDebug({ 'function' : 'getCamelCaseForm', 'param' : $_name });
	return isset($_name) ? ($_name.charAt(0).toUpperCase()) + ($_name.substring(1)) : '';
}
/**
 * Objet de type date à l'instant du chargement du fichier
 * @var function
 */
var DATE = new Date();
/**
 * Fonction permettant de récupérer la date à l'instant t selon le format souhaité (19 Aout 2008):
 *	- YYMMDD : 080819
 *	- YYYYMMDD : 20080819
 *	- DDMMYY : 190808
 *	- DDMMYYYY : 19082008
 *
 * @param $_format string le format souhaité
 * @param $_separator string optional le séparateur à utilisé pour séparé les années des mois des jours
 * @return string
 */
function getDateNow(/*string*/$_format/*string, $_separator*/)
{
	var dateNow = new Date();
	var Y = dateNow.getFullYear();
	var M = (parseInt(dateNow.getMonth() + 1) < 10 ? '0' + parseInt(dateNow.getMonth() + 1) : parseInt(dateNow.getMonth() + 1));
	var D = (dateNow.getDate() < 10 ? '0' + dateNow.getDate() : dateNow.getDate());
	/**
	 * Récupération de l'éventuel séparateur
	 */
	var s = isset(arguments[1]) ? arguments[1] : '';
	switch ($_format)
	{
		case 'YYMMDD':
			return new String(Y).substr(2, 2) + s + M + s + D;
			break;
		case 'YYYYMMDD':
			return Y + s + M + s + D;
			break;
		case 'DDMMYY':
			return D + s + M + s + new String(Y).substr(2, 2);
			break;
		case 'DDMMYYYY':
			return D + s + M + s + Y;
			break;
	}
	return '';
}
/**
 * Fonction permettant de récupérer la date à l'instant t selon le format souhaité (15h12m13s):
 *	- HHMMSS : 151213
 *	- HHhMMmSSs : 15h12m13s
 *
 * @param $_format string le format souhaité
 * @param $_separator string optional le séparateur à utilisé pour séparé les heures des minutes des secondes
 * @return string l'heure au format demandé
 */
function getHourNow(/*string*/$_format/*string, $_separator*/)
{
	var dateNow = new Date();
	var H = (dateNow.getHours() < 10 ? '0' + dateNow.getHours() : dateNow.getHours());
	var M = (dateNow.getMinutes() < 10 ? '0' + dateNow.getMinutes() : dateNow.getMinutes());
	var S = (dateNow.getSeconds() < 10 ? '0' + dateNow.getSeconds() : dateNow.getSeconds());
	/**
	 * Récupération de l'éventuel séparateur
	 */
	var p = isset(arguments[1]) ? arguments[1] : '';
	switch ($_format)
	{
		case 'HHMMSS':
			return H + p + M + p + S;
			break;
		case 'HHhMMmSSs':
			return h + 'h' + M + 'm' + S + 's';
			break;
	}
	return '';
}
/**
 * Méthode permettant de parser une url et d'en récupérer les composants
 * @param $_url string l'url à parser
 * @param $_component string l'élément de l'url à récupérer
 * @return string|array
 */
function parse_url($_url, $_component)
{
	// http://kevin.vanzonneveld.net
	// +      original by: Steven Levithan (http://blog.stevenlevithan.com)
	// + reimplemented by: Brett Zamir (http://brett-zamir.me)
	// %          note: Based on http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	// %          note: blog post at http://blog.stevenlevithan.com/archives/parseuri
	// %          note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	// %          note: Does not replace invaild characters with '_' as in PHP, nor does it return false with
	// %          note: a seriously malformed URL.
	// %          note: Besides function name, is the same as parseUri besides the commented out portion
	// %          note: and the additional section following, as well as our allowing an extra slash after
	// %          note: the scheme/protocol (to allow file:/// as in PHP)
	// *     example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
	// *     returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
	// Added one optional slash to post-protocol to catch file:/// (should restrict this)
	var o = { strictMode : false, key : [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ], q : { name : "queryKey", parser : /(?:^|&)([^&=]*)=?([^&]*)/g }, parser : { strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ } };
	var m = o.parser[o.strictMode ? "strict" : "loose"].exec($_url),uri = {},i = 14;
	while (i--)
		uri[o.key[i]] = m[i] || "";
	// Uncomment the following to use the original more detailed (non-PHP) script
	/*
	    uri[o.q.name] = {};
	    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
	    if ($1) uri[o.q.name][$1] = $2;
	    });
	    return uri;
	*/
	switch ($_component)
	{
		case 'PHP_URL_SCHEME':
			return uri.protocol;
		case 'PHP_URL_HOST':
			return uri.host;
		case 'PHP_URL_PORT':
			return uri.port;
		case 'PHP_URL_USER':
			return uri.user;
		case 'PHP_URL_PASS':
			return uri.password;
		case 'PHP_URL_PATH':
			return uri.path;
		case 'PHP_URL_QUERY':
			return uri.query;
		case 'PHP_URL_FRAGMENT':
			return uri.anchor;
		default:
			var retArr = {};
			if (uri.protocol !== '')
				retArr.scheme = uri.protocol;
			if (uri.host !== '')
				retArr.host = uri.host;
			if (uri.port !== '')
				retArr.port = uri.port;
			if (uri.user !== '')
				retArr.user = uri.user;
			if (uri.password !== '')
				retArr.pass = uri.password;
			if (uri.path !== '')
				retArr.path = uri.path;
			if (uri.query !== '')
				retArr.query = uri.query;
			if (uri.anchor !== '')
				retArr.fragment = uri.anchor;
			return retArr;
	}
}
/**
 * Fonction de récupération de l'hôte pour une url donnée
 * @param $_url string l'url
 * @return string
 */
function getUrlHost($_url)
{
	return parse_url($_url, 'PHP_URL_HOST');
}
/**
 * Fonction de récupération du path pour une url donnée
 * @param $_url string l'url
 * @return string
 */
function getUrlPath($_url)
{
	return parse_url($_url, 'PHP_URL_PATH');
}
/**
 * Définition de variables à partir de l'objet de YAHOO
 */
/**
 * Objet de manipulation du dom
 */
if (typeof YAHOO != 'undefined')
{
	if (isset(YAHOO) && isset(YAHOO.util) && isset(YAHOO.util.Dom))
		var DOM = YAHOO.util.Dom;
	/**
	 * Objet de manipulation des événements
	 */
	if (isset(YAHOO) && isset(YAHOO.util) && isset(YAHOO.util.Event))
		var EVENT = YAHOO.util.Event;
}
