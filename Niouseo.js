/**
 * @package Niouseo
 * @subpackage Niouseo
 * @author Mikaël DELSOL
 * @copyright Mikaël DELSOL
 * @version 1.0 
 */
/**
 * NIOUSEO is a tool to help you in your Search Engine Optimization campaign.
 * Actually, this tool includes the most popular search engines in order to be the most efficient.
 * Firstly, it gives you the range of your website for the keywords you typed in and it offers you the possibility to configure
 * very precisely how to search what you search. 
 * Moreover, it gives you the Pagerank for every website given by a research (backlinks search, range search, etc.)
 * The more you use it, the fast you'll use it cause it offers you the possibility to create profiles which represent
 * the configurations you chossed. Indeed, a profile save every paramter you choosed for a research, just name it the most speacking to you
 * and you'll be able to use it later. And if the name is not sufficent, just add a comment to your profile, for exemple, 
 * how the parameters are adapted to what you look for, or anything else.
 * Finally, you can save every results given during your research. All you have to do is to host a database and your work will be saved for ever.  
 *
 * This tool is free to use and under the GPL Licence.
 *
 * I hope you'll enjoy it. If you see some bugs or missing function(s), let me know and I'll consider your remarques with great attention.
 *
 */
if (typeof isset != 'undefined' && isset(NIOUSEO))
{
	(function()
	{
		/**
		 * Raccourci vers la définition du prototype de la classe
		 */
		var N = NIOUSEO.prototype;
		var NIOUSEO_NAME = 'NIOUSEO';
		var NIOUSEO_REGISTER = 'REGISTER';
		/**
		 * Informations relatives à la classe
		 */
		N.classInfo = { 'appName' : 'NIOUSEO', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '19/04/08' };
		/**
		 * Méthode renvoyant le nom de cette classe
		 *
		 * @return string NIOUSEO
		 */
		N.toString = function toString()
		{
			return NIOUSEO_NAME;
		};
		/**
		 * Classe générique contenant les méthodes générales applicables à toutes classes
		 */
		N.NiouseoGen = function NiouseoGen()
		{
			this.classInfo = { 'appName' : 'NiouseoGen', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '07/06/08' };
			/**
			 * Attribut définissant si l'objet est instancié ou non
			 * @var bool
			 */
			this.isInit = false;
			/**
			 * Attribut définissant si on active ou non l'affichage des debug dans la console
			 * @var bool
			 */
			this.displayDebug = false;
			/**
			 * Parent de l'objet
			 * @var object
			 */
			this.parent = {};
			/**
			 * Niveau d'héritage des classes
			 * @var Array
			 */
			this.superClasses = new Array();
			/**
			 * Objet de la classe AttributeFactory permettant ainsi à chaque classe de se créer des attributs et les méthodes par défaut de ses attributs
			 * @var AttributeFactory
			 */
			this.attributeFactory = {};
			/**
			 * Objet de la classe Viewer permettant la gestion d'un interface
			 * @var Viewer
			 */
			this.objectView = null;
			/**
			 * Objet de la classe translations permettant le chargement et la manipulation des traductions de l'objet
			 * @var Translations
			 */
			this.objectTranslations = null;
			/**
			 * Objet de la classe Timer permettant la gestion des appels différés dans le temps
			 * @var Timer
			 */
			this.objectTimer = null;
			/**
			 * Tableau contenant les éléments enregistrés par la fonction registerProperty accessible par la méthode getRegister(), getRegisterValue($_registerName)
			 * @var Array
			 */
			this.register = [];
			/**
			 * Identifiant unique de l'objet
			 */
			this.id = '';
			/**
			 * Identifiant unique de l'objet
			 */
			this.name = '';
			/**
			 * Cookie créé avec Yahoo
			 */
			this.cookie = '';
			/**
			 * Méthode renvoyant le nom de cette classe
			 *
			 * @return string gen
			 */
			this.toString = function toString()
			{
				return this.NIOUSEOGEN;
			};
			/**
			 * Méthode permettant de récupérer une information contenu par classInfo
			 * @param $_info string|null l'élément à récupérer
			 * @return string|Object
			 */
			this.getClassInfo = function getClassInfo($_info)
			{
				return (isset($_info) && keyInArray($_info, this.classInfo)) ? this.classInfo[$_info] : this.classInfo;
			};
			/**
			 * Méthode d'affichage des logs
			 *
			 * @param $_type string le contexte du message (méthode)
			 * @param $_mess string le message
			 * @param $_isError bool indique si c'est une erreur ou un message informatif
			 * @return bool true
			 */
			this.displayLog = function displayLog(/*string*/$_type,/*string*/$_mess,/*bool*/$_isError)
			{
				if (isTrue(this.getDisplayDebug()) && isset(console) && this.isLocal())
				{
					lineDisplayLog = typeof lineDisplayLog != 'undefined' ? lineDisplayLog : 0;
					var startTime = getHourNow('HHMMSS', ':');
					if (isTrue($_isError))
					{
						console.error(startTime + ' -> ' + this.toString() + '::' + $_type + ' : ', $_mess);
						if (isset(document.getElementById('console')))
							document.getElementById('console').innerHTML = '\n<br>&nbsp;' + lineDisplayLog + ' | <font color="red">' + this.toString() + ' : ' + $_type + ' : ' + $_mess + '</font>' + document.getElementById('console').innerHTML;
						lineDisplayLog = parseInt(lineDisplayLog + 1);
					}
					if (isFalse($_isError))
						console.info(startTime + ' -> ' + this.toString() + '::' + $_type, ' : ', $_mess);
				}
				return true;
			};
			/**
			 * Méthode de définition de la valeur de displayLog afin d'activer ou non l'affichage des logs
			 * 
			 * @param $_displayDebug bool la valeur à affecter à displayLog
			 * @return bool true 
			 */
			this.setDisplayDebug = function setDisplayDebug(/*bool*/$_displayDebug)
			{
				this.displayDebug = $_displayDebug;
				if (this.getAttributeFactory() && isset(this.getAttributeFactory().displayDebug))
					this.getAttributeFactory().setDisplayDebug($_displayDebug);
				if (this.getOV() && isset(this.getOV().displayDebug))
					this.getOV().setDisplayDebug($_displayDebug);
				if (this.getOTr() && isset(this.getOTr().displayDebug))
					this.getOTr().setDisplayDebug($_displayDebug);
				if (this.getOTi() && isset(this.getOTi().displayDebug))
					this.getOTi().setDisplayDebug($_displayDebug);
				return this.displayLog('setDisplayDebug', $_displayDebug);
			};
			/**
			 * Méthode de récupération de la valeur de displayLog
			 * 
			 * @return bool displayLog
			 */
			this.getDisplayDebug = function getDisplayDebug()
			{
				return this.displayDebug || DEBUG;
			};
			/**
			 * Méthode de définition du parent de l'objet
			 * 
			 * @param $_parent object le parent de l'objet
			 * @return bool true
			 */
			this.setParent = function setParent($_parent)
			{
				this.parent = $_parent;
				return this.displayLog('setParent', $_parent);
			};
			/**
			 * Méthode d'accés au parent de l'objet
			 * 
			 * @return bool true
			 */
			this.getParent = function getParent()
			{
				return this.parent;
			};
			/**
			 * Méthode de définition des classes méres
			 * 
			 * @param $_superClasses array les classes méres
			 * @return bool true
			 */
			this.setSuperClasses = function setSuperClasses($_superClasses)
			{
				this.superClasses = $_superClasses;
				return this.displayLog('setSuperClasses', $_superClasses);
			};
			/**
			 * Méthode d'accés aux classes méres
			 * 
			 * @return bool true
			 */
			this.getSuperClasses = function getSuperClasses()
			{
				return this.superClasses;
			};
			/**
			 * Méthode permettant de récupérer la classe mére de l'objet en cours
			 * @return object
			 */
			this.getSuperClass = function getSuperClass($_currentClassName)
			{
				return this.getSuperClasses()[isset($_currentClassName)?$_currentClassName:this.toString()];
			};
			/**
			 * Méthode de définition du nom dans le dom de l'objet javascript
			 * 
			 * @param $_name string le nom
			 * @return bool true
			 */
			this.setName = function setName($_name)
			{
				this.name = $_name;
				return this.displayLog('setName', $_name);
			};
			/**
			 * Méthode d'accés au nom
			 * 
			 * @return string
			 */
			this.getName = function getName()
			{
				return this.name;
			};
			/**
			 * Méthode de définition de l'objet de vue
			 * 
			 * @param $_objectView object l'objet de vue
			 * @return bool true
			 */
			this.setObjectView = function setObjectView($_objectView)
			{
				this.objectView = $_objectView;
				if (isset(this.objectView.setParent))
				{
					this.objectView.setParent(this);
					if (isset(this.objectView.getParent().CONTEXT_TO_CALL))
						this.objectView.setNiouseoContextToCall(this.objectView.getParent().CONTEXT_TO_CALL);
				}
				return this.displayLog('setObjectView', $_objectView);
			};
			this.setOV = this.setObjectView;
			/**
			 * Méthode d'accés à l'objet de vue
			 * 
			 * @return Viewer
			 */
			this.getObjectView = function getObjectView()
			{
				return this.objectView;
			};
			this.getOV = this.getObjectView;
			/**
			 * Méthode de définition de l'objet de traductions
			 * 
			 * @param $_objectTranslations object l'objet de traduction
			 * @return bool true
			 */
			this.setObjectTranslations = function setObjectTranslations($_objectTranslations)
			{
				this.objectTranslations = $_objectTranslations;
				if (isset(this.objectTranslations.setParent))
					this.objectTranslations.setParent(this);
				return this.displayLog('setTranslations', $_objectTranslations);
			};
			this.setOTr = this.setObjectTranslations;
			/**
			 * Méthode d'accés à l'objet de traductions
			 * 
			 * @return Translations
			 */
			this.getObjectTranslations = function getObjectTranslations()
			{
				return this.objectTranslations;
			};
			this.getOTr = this.getObjectTranslations;
			/**
			 * Méthode de définition de l'objet de timer
			 * 
			 * @param $_objectTimer object l'objet Timer
			 * @return bool true
			 */
			this.setObjectTimer = function setObjectTimer($_objectTimer)
			{
				this.objectTimer = $_objectTimer;
				if (isset(this.objectTimer.setParent))
					this.objectTimer.setParent(this);
				return this.displayLog('setObjectTimer', $_objectTimer);
			};
			this.setOTi = this.setObjectTimer;
			/**
			 * Méthode d'accés à l'objet de traductions
			 * 
			 * @return Timer
			 */
			this.getObjectTimer = function getObjectTimer()
			{
				return this.objectTimer;
			};
			this.getOTi = this.getObjectTimer;
			/**
			 * Méthode pour faire appeler une méthode toutes les secondes souhaité
			 * @param $_functionToCall string nom de la fonction à appeler
			 * @param $_everySeconds float
			 * @param $_untilSeconds float
			 * @return bool true|false
			 */
			this.callEvery = function callEvery($_functionToCall, $_everySeconds, $_untilSeconds)
			{
				if (!isObject(this.getOTi()))
					this.setOTi(new N.Timer(this.getDisplayDebug()));
				return this.displayLog('callEvery', arguments, !this.getOTi().callEvery(this, $_functionToCall, $_everySeconds, $_untilSeconds));
			};
			/**
			 * Méthode pour faire appeler une méthode dans un certain temps
			 * @param $_functionToCall string fonciton à appeler
			 * @param $_inSeconds float
			 * @return bool true|false
			 */
			this.callIn = function callIn($_functionToCall, $_inSeconds)
			{
				if (!isObject(this.getOTi()))
					this.setOTi(new N.Timer(this.getDisplayDebug()));
				return this.displayLog('callIn', arguments, !this.getOTi().callIn(this, $_functionToCall, $_inSeconds));
			};
			/**
			 * Méthode permettant de se retirer des appels réguliers
			 * @param $_functionToCall string nom de la méthode à ne plus appeler/null=>toutes les méthodes
			 * @return bool true|false
			 */
			this.stopCalls = function stopCalls($_functionToCall)
			{
				return this.displayLog('stopCalls', $_functionToCall, isObject(this.getOTi()) ? !this.getOTi().stopCalls(this, $_functionToCall) : true);
			};
			/**
			 * Méthode de définition de l'objet AttributeFactory
			 *
			 * @param $_attributeFactory object attributeFactory
			 * @return bool true
			 */
			this.setAttributeFactory = function setAttributeFactory(/*object*/$_attributeFactory)
			{
				this.attributeFactory = $_attributeFactory;
				return this.displayLog('setAttributeFactory', $_attributeFactory);
			};
			/**
			 * Méthode de récupération de l'objet AttributeFactory
			 *
			 * @return object attributeFactory
			 */
			this.getAttributeFactory = function getAttributeFactory()
			{
				return this.attributeFactory;
			};
			/**
			 * Méthode retournant l'attribut register
			 * @return Array
			 */
			this.getRegister = function getRegister()
			{
				return this.register;
			};
			/**
			 * Méthode retournant l'attribut register
			 * @param $_register Array le registre
			 * @return bool true
			 */
			this.setRegister = function setRegister($_register)
			{
				this.register = $_register;
				return this.displayLog('setRegister', $_register);
			};
			/**
			 * Méthode retournant le registre des valeurs propres à la classe
			 * @return Array
			 */
			this.getRegisterOfMe = function getRegisterOfMe()
			{
				return this.getRegister()[this.toString()];
			};
			/**
			 * Méthode permettant de récupérer la valeur d'un élément dans le registre par son index
			 * @param $_registerName string l'index
			 * @return mixed|null
			 */
			this.getRegisterValue = function getRegisterValue($_registerName)
			{
				this.displayLog('getRegisterValue', $_registerName);
				if (isArray(this.getRegisterOfMe()) && keyInArray($_registerName, this.getRegisterOfMe()))
					return this.getRegisterOfMe()[$_registerName];
				else
					return null;
			};
			/**
			 * Méthode de définition de la valeur de l'id
			 * @param $_id string l'id de l'objet
			 * @return bool true
			 */
			this.setId = function setId($_id)
			{
				this.id = $_id;
				return this.displayLog('setId', $_id);
			};
			/**
			 * Méthode de récupération de la valeur de l'id de l'objet
			 * @return string
			 */
			this.getId = function getId()
			{
				return this.id;
			};
			/**
			 * Méthode retournant un id unique pour l'objet
			 * @return string
			 */
			this.getUniqueId = function getUniqueId()
			{
				return this.toString() + '_' + getDateNow('DDMMYYYY') + '_' + getHourNow('HHMMSS') + '_' + new String(Math.random()).replace(/0\./, '');
			};
			/**
			 * Méthode retournant l'objet de la classe mére de toute classe permettant d'accéder aux méthodes génériques méres
			 * @return NiouseoGen objet de la clase NiouseoGen
			 */
			this.getSuper = function getSuper()
			{
				var superClass = new N.NiouseoGen();
				superClass._construct();
				return superClass;
			};
			/**
			 * Méthode d'initiliasition des attributes particuliers de la classe
			 * @return bool true 
			 */
			this.initVars = function initVars()
			{
				/**
				 * Enregistrement de la propriété user au sein de la classe NIOUSEO
				 */
				N.registerProperty(this, 'CONTEXT_TO_CALL', 'niouseo');
				/**
				 * Nom de la variable utilisée pour identifier le cookie
				 */
				N.registerProperty(this, 'NIOUSEO_COOKIE', 'NIOUSEO_COOKIE');
				/**
				 * Valeur utilisée pour définir le hash
				 */
				N.registerProperty(this, 'NIOUSEO_HASH', '');
				/**
				 * Valeur utilisée pour définir le hash
				 */
				N.registerProperty(this, 'NIOUSEO_HASH_SEP', '&');
				/**
				 * Valeur utilisée pour définir le symbole affectant la valeur au hash
				 */
				N.registerProperty(this, 'NIOUSEO_HASH_AFFECTOR', '=');
				this.setId(this.getUniqueId());
				this.isInit = true;
				this.initCookie();
				return this.displayLog('initVars', 'InitVars de ' + this.toString());
			};
			/**
			 * Méthode d'initialisation du cookie
			 * @return bool true
			 */
			this.initCookie = function initCookie()
			{
				this.setCookie(this.getCookieValue());
				if (isset(this.getOV) && isset(this.getOV()))
					this.getOV().setCookie(this.getCookie());
				if (isset(this.getOTr) && isset(this.getOTr()))
					this.getOTr().setCookie(this.getCookie());
				if (isset(this.getOTi) && isset(this.getOTi()))
					this.getOTi().setCookie(this.getCookie());
				return this.displayLog('initCookie', 'Initialisation de la valeur du cookie de l\'objet avec ' + this.getCookieValue());
			};
			/**
			 * Méthode d'initialisation des traductions de l'objet
			 * @return bool true|false
			 */
			this.initTranslations = function initTranslations()
			{
				if (isset(this.getOTr) && isset(this.getOTr()))
					return this.displayLog('initTranslations', 'Chargement des traductions avec l\'objet de traductions', !this.getOTr().loadTranslations());
				else
					return this.displayLog('initTranslations', 'Initialiser l\'objet de tradcution au préalable', true);
			};
			/**
			 * Méthode permettant de savoir si le cookie est effectivement défini au niveau du navigateur
			 * @return bool true|false
			 */
			this.cookieIsSet = function cookieIsSet()
			{
				return isset(YAHOO.util.Cookie.get(this.getCookieName()));
			};
			/**
			 * Méthode de récupération du cookie créé
			 * @return string
			 */
			this.getCookie = function getCookie()
			{
				return this.cookie;
			};
			/**
			 * Méthode de définition de la valeur du cookie
			 * @param $_cookie string le cookie
			 * @return bool true
			 */
			this.setCookie = function setCookie($_cookie)
			{
				this.cookie = $_cookie;
				return this.displayLog('setCookie', $_cookie);
			};
			/**
			 * Méthode permettant de créer el cookie au sein du navigateur pour indiquer que l'objet est en session ou autre
			 * @return bool true
			 */
			this.createCookie = function createCookie()
			{
				if (!this.cookieIsSet())
					YAHOO.util.Cookie.set(this.getCookieName(), this.getCookieValue());
				return this.displayLog('createCookie', this.getCookieValue(), !this.cookieIsSet());
			};
			/**
			 * Méthode de suppression du cookie
			 * @return bool true
			 */
			this.removeCookie = function removeCookie()
			{
				this.setCookie(null);
				if (this.cookieIsSet())
					YAHOO.util.Cookie.remove(this.getCookieName());
				return this.displayLog('removeCookie', 'Suppression du cookie');
			};
			/**
			 * Méthode retournant la valeur devabnt étre enregistrée pour l'objet
			 * @return string
			 */
			this.getCookieValue = function getCookieValue()
			{
				return this.getUniqueId();
			};
			/**
			 * Méthode retournant le nom donnée au cookie pour l'objet en cours au niveau du navigateur
			 * @return string
			 */
			this.getCookieName = function getCookieName()
			{
				return this.NIOUSEO_COOKIE + '_' + this.toString();
			};
			/**
			 * Méthode permettant de définir un cookie et sa valeur
			 * @param $_cookieName sting nom du cookie
			 * @param $_cookieValue string valeur du cookie
			 * @return bool true|false
			 */
			this.addCookieValue = function addCookieValue($_cookieName, $_cookieValue)
			{
				return this.displayLog('addCookieValue', arguments, !YAHOO.util.Cookie.set($_cookieName, $_cookieValue));
			};
			/**
			 * Méthode permettant de récupérer la valeur d'un cookie ajouté
			 * @param $_cookieName sting nom du cookie
			 * @return mixed
			 */
			this.getAddedCookie = function getAddedCookie($_cookieName)
			{
				var addedCookie = YAHOO.util.Cookie.get($_cookieName);
				return isset(addedCookie) ? addedCookie : null;
			};
			/**
			 * Méthode permettant de faire générer les méthodes sur les attributs de l'objet passé en paramétre
			 * @param $_object Object objet
			 * @return bool true
			 */
			this.generateMethods = function generateMethods($_object, $_attributeName, $_attributeValue)
			{
				if (isset(this.getAttributeFactory()))
				{
					if (isObject($_object) || isArray($_object))
					{
						for ( var attribute in $_object)
						{
							if (!isString($_object[attribute]))
								this.generateMethods($_object[attribute], null, null);
							else
							{
								if (isObject($_object))
								{
									this.getAttributeFactory().setObject($_object);
									this.getAttributeFactory().appendAttribute(attribute, $_object[attribute]);
								}
							}
						}
					}
					else
					{
						if (isObject($_object))
						{
							this.getAttributeFactory().setObject($_object);
							this.getAttributeFactory().appendAttribute($_attributeName, $_attributeValue);
						}
					}
				}
				return this.displayLog('generateMethods', $_object);
			};
			/**
			 * Méthode de définition de l'url ou de la position dans la page (application)
			 * @param $_hash string le nom du hash
			 * @param $_value string la valeur du hash (si null, la valeur est supprimée du hash)
			 * @return bool true
			 */
			this.setHashValue = function setHashValue($_hashName, $_hashValue)
			{
				var hash = location.hash;
				var pregHash = new RegExp('#' + this.NIOUSEO_HASH);
				/**
				 * Suppression de notre préfixe de hash
				 */
				var hashValue = hash.replace(pregHash, '');
				var hashes = hashValue.split(this.NIOUSEO_HASH_SEP);
				var hashesToHash = new Array();
				/**
				 * Parcoure des hash déjé définis
				 */
				if (hashes.length > 0 && hashes[0] != '')
				{
					for ( var hashName in hashes)
					{
						var hashDetails = hashes[hashName];
						var hashesNames = hashDetails.split(this.NIOUSEO_HASH_AFFECTOR);
						if (hashesNames[0] == $_hashName)
						{
							/**
							 * Cela permet de supprimer la valeur du hash
							 */
							if (isset($_hashValue))
								hashesToHash[hashesNames[0]] = $_hashValue;
						}
						else
							hashesToHash[hashesNames[0]] = hashesNames[1];
					}
				}
				/**
				 * Vérification que la clef est bien définie
				 */
				if (!keyInArray($_hashName, hashesToHash) && isset($_hashValue))
					hashesToHash[$_hashName] = $_hashValue;
				/**
				 * Parcoure des clefs à définir
				 */
				var newhash = '';
				for ( var hashName in hashesToHash)
					newhash += (newhash == '' ? '' : this.NIOUSEO_HASH_SEP) + hashName + this.NIOUSEO_HASH_AFFECTOR + hashesToHash[hashName];
				/**
				 * Définition de la nouvelle valeur du hash
				 */
				newhash = this.NIOUSEO_HASH + ((newhash == '' && !isset($_hashValue)) ? '#' : '#' + newhash.replace(/#/, ''));
				/**
				 * Applications du hash
				 */
				return this.displayLog('setHashValue', newhash, !(location.hash = newhash));
			};
			/**
			 * Méthode de récupération de la valeur d'un clef du hash
			 * @param $_hashName string nom de la clef dans le hash
			 * @return mixed|null
			 */
			this.getHashValue = function getHashValue($_hashName)
			{
				var hash = location.hash;
				var newhash = '';
				var pregHash = new RegExp('#' + this.NIOUSEO_HASH);
				/**
				 * Suppression de notre préfixe de hash
				 */
				var hashValue = hash.replace(pregHash, '');
				var hashes = hashValue.split(this.NIOUSEO_HASH_SEP);
				/**
				 * Valeur retournée
				 */
				var hashValue = null;
				/**
				 * Parcoure des hash déjé définis
				 */
				if (hashes.length > 0 && hashes[0] != '')
				{
					for ( var hashName in hashes)
					{
						var hashDetails = hashes[hashName];
						var hashesNames = hashDetails.split(this.NIOUSEO_HASH_AFFECTOR);
						if (hashesNames[0] == $_hashName)
						{
							hashValue = hashesNames[1];
							break;
						}
					}
				}
				return hashValue;
			};
			/**
			 * Méthode permettant de supprimer une valeur du hash
			 * @param $_hashName string le nom du pamraétre dans le hash
			 * @return bool true
			 */
			this.removeHashValue = function removeHashValue($_hashName)
			{
				return this.setHashValue($_hashName, null);
			};
			/**
			 * Méthode permettant de supprimer tous les hash de l'url.
			 * L'appel de cette méthode a pour effeet de recharger la page sans tous les paramétres hash de l'url
			 * @return bool true
			 */
			this.removeAllHashValues = function removeAllHashValues()
			{
				return this.displayLog('removeAllHashValues', 'Suppression des hash', !(location.hash = '#'));
			};
			/**
			 * Méthode de redéfinition de l'url pour recharger la page ou autre
			 * 
			 * @param $_url string la nouvelle url
			 * @return bool true
			 */
			this.redirectTo = function redirectTo($_url)
			{
				if (isset(this.showRefreshing))
					this.showRefreshing();
				else
				{
					if (isset(this.getOV()))
						this.getOV().showRefreshing();
				}
				var url = isset($_url) ? $_url : location.protocol + '//' + location.hostname + location.pathname;
				url = url.charAt(0) == '?' ? location.protocol + '//' + location.hostname + location.pathname + url : url;
				return this.displayLog('redirectTo', Array($_url, url), !(location.href = url));
			};
			/**
			 * Méthode permettant de savoir si l'application est locale ou non
			 * @return
			 */
			this.isLocal = function isLocal()
			{
				return (window.location.hostname == N.INTERN_SERVER_URL);
			};
			/**
			 * Contructeur de la classe
			 *
			 * @param $_displayLog bool optional attribut définissant si on active ou pas l'affichage du debug dans la console 
			 * @return object gen 
			 */
			this._construct = function _construct(/*bool $_displayLog*/)
			{
				/**
				 * Nom de la classe
				 */
				N.registerProperty(this, 'NIOUSEOGEN', 'NiouseoGen');
				if (isset(arguments[0]))
					this.setDisplayDebug(arguments[0]);
				if (this.toString() != this.NIOUSEOGEN)
				{
					try
					{
						if (this.toString() != 'AttributeFactory')
						{
							this.setAttributeFactory(new N.AttributeFactory());
							this.getAttributeFactory().setParent(this);
							this.getAttributeFactory()._construct(arguments);
						}
					}
					catch (e)
					{
						this.displayLog('_construct', 'Erreur de définition des objets de la classe pour "' + this.toString() + '" : \r\n"' + e + '"', true);
					}
				}
				else
					this.initVars();
				this.displayLog('_construct', 'Intantiation de ' + this.toString());
				return this;
			};
		};
		/**
		 * Méthode d'héritage de classe
		 *
		 * @param $_child object la clase fille à hériter
		 * @param $_parent object la classe mére de laquelle le classe fille doit hériter
		 * @param $_construct bool optional indique si la classe mére passée en paramétre est à instancier ou non
		 * @return bool true si ok, sinon affiche un message d'erreur
		 */
		N.extend = function extend(/*object*/$_child,/*object*/$_parent/*, bool $_construct*/)
		{
			N.registerProperty(this, 'EXTEND', 'extend');
			this.toString = function toString()
			{
				return this.EXTEND;
			};
			$_child = $_child || {};
			$_parent = $_parent || {};
			if (isFalse($_parent.isInit))
			{
				var parentObject = new $_parent();
				if (isFalse(arguments[2]))
				{
					parentObject._construct(typeof DEBUG != 'undefined' ? DEBUG : false);
					var gen = new N.gen();
					gen._construct();
					if (parentObject.toString() != gen.toString())
						parentObject.initVars();
				}
			}
			else
				var parentObject = $_parent;
			if (isset(parentObject))
			{
				if ($_child.toString() != NIOUSEO_NAME && $_parent.toString() != NIOUSEO_NAME)// && parent.toString() != 'NIOUSEO')
				{
					if (isFalse(parentObject.isInit))
					{
						$_child.prototype = new $_parent;
						$_child.prototype.superclass = new $_parent;
						$_child.prototype.superClasses[$_child.toString().split(/ /)[1].substring(0,$_child.toString().split(/ /)[1].lastIndexOf('('))] = new $_parent;
						//$_child.setRegister(new Array());
						return $_parent.displayLog('extend', 'Héritage de la classe fille ' + $_child.toString() + ' à partir de la classe mére ' + $_parent.toString() + ' fait avec succés (1).');
					}
					else
					{
						$_child.prototype = parentObject;
						$_child.prototype.superclass = new $_parent;//parent;
						$_child.prototype.superClasses[$_child.toString().split(/ /)[1].substring(0,$_child.toString().split(/ /)[1].lastIndexOf('('))] = new $_parent;
						//$_child.prototype.setRegister($_child.prototype);//,new Array());
						return parentObject.displayLog('extend', 'Héritage de la classe fille ' + $_child.toString() + ' à partir de la classe mére ' + parent.toString() + ' fait avec succés (2).');
					}
				}
				else
				{
					for ( var attr in parent)
					{
						/**
						 * On ne redéfinit pas les attribut/méthodes déjé définis dans la classe fille,
						 * on ne fait qu'ajouter les méthodes génériques
						 */
						if (!isset($_child[attr]))
							$_child.prototype[attr] = parent[attr];
					}
					$_child.prototype.superclass = parent;
					$_child.prototype.superClasses[$_child.toString().split(/ /)[1].substring(0,$_child.toString().split(/ /)[1].lastIndexOf('('))] = parent;
					return true;//$_child.displayLog('extend','Héritage de la classe fille '+$_child.toString()+' à partir de la classe mére '+parent.toString()+' fait avec succés',false);
				}
			}
			else
				return !displayDebug('extend', 'Initialisation de la classe mére non fait. Arrét de l\'héritage', true);
		};
		/**
		 * Méthode d'ajout de propriétés à un objet
		 * 
		 * @param $_parent object l'objet auquel il faut ajouter la propriété
		 * @param $_propertyName string le nom à donner à cette propriété
		 * @param $_child object la propriété à ajouter
		 * @return bool true en affichant un message si displayLog est actif
		 */
		N.registerProperty = function registerProperty(/*object*/$_parent,/*string*/$_propertyName,/*object*/$_child)
		{
			if (!isset($_child))
				return !this.displayLog('registerProperty', 'La classe fille n\'est pas définie', true);
			if (!isset($_parent))
				return !this.displayLog('registerProperty', 'La classe mére n\'est pas définie', true);
			$_parent[$_propertyName] = $_child;
			/**
			 * Ajout de la propriété au registre
			 */
			if (isset($_parent.getRegister))
			{
				if (!keyInArray($_parent.toString(), $_parent.getRegister()))
					$_parent.getRegister()[$_parent.toString()] = new Array();
				addValueToArray($_parent.getRegister()[$_parent.toString()], $_child, $_propertyName);
			}
			/*
			if ($_parent.toString() && $_parent.toString() == NIOUSEO_NAME)
				N[$_propertyName] = $_child;
			else
			{
				N[NIOUSEO_REGISTER][$_parent] = N[NIOUSEO_REGISTER][$_parent] || {};
				N[NIOUSEO_REGISTER][$_parent][$_propertyName] = $_child;
				N[NIOUSEO_REGISTER][$_propertyName] = $_child;
			}*/
			return displayDebug('registerProperty', 'Ajout de la propriété ' + $_propertyName + ' avec ' + $_child + ' a ' + $_parent);
		};
		N.registerProperty(N, NIOUSEO_REGISTER, {});
		/**
		 * Compatibilité descendante suit eau renommage de la classe générique de base
		 */
		N.registerProperty(N, 'gen', N.NiouseoGen);
		/**
		 * Chemin vers le dossier du module Niouseo
		 */
		N.registerProperty(N, 'COMMON_PATH', N.MODULES_PATH + 'Common/');
		/**
		 * Chemin vers le dossier JS du module Niouseo
		 */
		N.registerProperty(N, 'COMMON_PATH_JS', N.COMMON_PATH + N.JS_PATH);
		/**
		 * Chemin vers le dossier Images du module Niouseo
		 */
		N.registerProperty(N, 'COMMON_PATH_IMG', N.COMMON_PATH + N.IMG_PATH);
		/**
		 * Chemin vers le dossier PHP du module Niouseo
		 */
		N.registerProperty(N, 'COMMON_PATH_PHP', N.COMMON_PATH + N.PHP_PATH);
		/**
		 * Classes de recherche disponibles
		 */
		N.registerProperty(N, 'WEBSEARCHAPIS', {});
	})();
}
var n = new NIOUSEO();
