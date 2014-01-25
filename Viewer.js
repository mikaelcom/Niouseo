/**
 * @package Niouseo
 * @subpackage NiouseoViewer
 * @author Mikaël DELSOL
 * @copyright Mikaël DELSOL
 * @version 1.0 
 */
if (typeof isset != 'undefined' && isset(NIOUSEO))
{
	(function()
	{
		/**
		 * Raccourci vers la définition du prototype de la classe
		 */
		var N = NIOUSEO.prototype;
		/**
		 * Classe de gestion des vues pour un module
		 * Elle permet de :
		 *	- définir les vues disponibles pour un module
		 *	- utiliser une vue particuliére
		 *	- appliquer les valeurs nécessaires à la vue
		 *	- afficher la vue dans la zone souhaitée
		 * Pourquoi une classe de gestion de template : les WebService Php des modules fournissent les données et pourraient donc utiliser un
		 * moteur de template (ex : Smarty), mais le but est de fournir une interface des plus modulable possible, c'est-à-dire modifiable
		 * à souhait par l'utilisateur. De ce fait, il faut que les données soient chargées indépendemment des vues et permettre ainsi
		 * de construire : 
		 * 	- soit à l'aide de vues prédéfinies en HTML (ex : Smarty) et gérée par le Javascript 
		 *	- soit à l'aide de YUI par la gestion des layout afin de générer des vues trés "dynamiques"
		 * les vues ou rapport de résultats et ainsi lmanipuler les données indépendemment des vues  
		 */
		var Viewer = function Viewer()
		{
			this.classInfo = { 'appName' : 'Viewer', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '12/09/08' };
			/**
			 * Nom de la classe de l'objet
			 * Attribut non modifiable
			 */
			this.toString = function toString()
			{
				return this.VIEWER;
			};
			/**
			 * Méthode d'intialisation des attributs principaux de la classe de gestion de vue
			 * @return bool true
			 */
			this.initVars = function initVars()
			{
				if (this.toString() == this.VIEWER)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendArrayOfAttributes(new Array({ 'name' : 'fields',//Liste des champs à gérer.Les champs sont définis par les éléments de l'interface.
				//Les attributs de la classe sont associés aux champs de l'interface permettant d'utiliser la classe, 
				//Un champ/attribut est un objet à part entiére detenant des methodes propres à lui méme. 
				//Les méthodes permettent à la fois le définir mais aussi de l'associer à un champ d'une interface. 
				'default' : {} }, { 'name' : 'views',//Tableau d'enregistrement des vues,Les vues sont enregsitrées par section afin de les différencier par méthode, action, contexte
				'default' : [] }, { 'name' : 'section', 'default' : '' }, { 'name' : 'keyStart',//Symbole de début utilisé pour encadrer la clef de l'élément dans le code
				'default' : '{' }, { 'name' : 'keyEnd',//Symbole de fin utilisé pour encadrer la clef de l'élément dans le code
				'default' : '}' }, { 'name' : 'doms',//Id des éléments de l'interface HTML
				'default' : [] }, { 'name' : 'alert',//Objet de représentation d'un alert
				'default' : false }, { 'name' : 'subMenuContent',//Contenu du sous-menu de la classe
				'default' : '' }, { 'name' : 'yuiMenu',//Objet de la classe TabView Yahoo de gestion du sous-menu et de passage au page
				'default' : {} }, { 'name' : 'subMenuId',//Id du container (UL) du sous-menu de la classe
				'default' : '' }, { 'name' : 'centralContent',//Contenu de la partie central
				'default' : false }, { 'name' : 'confirmBox',//Objet de représentation d'une popin de confirmation/annulation
				'default' : false }));
				this.setAlert(null);
				this.setConfirmBox(null);
				this.setYuiMenu(null);
				this.addToDoms(this.SIDEBAR_ZONE, Array());
				this.addToDoms(this.CONTENT_ZONE, Array());
				return this.displayLog('initVars', 'Fin de la méthode');
			};
			/**
			 * Méthode appelée aprés la récupération du sous-menu et du cotenu afin d'initialiser les éléments HTML pris en charge par la classe de la vue
			 * @return bool true
			 */
			this.init = function init()
			{
				return this.displayLog('init', 'Appel de la méthode');
			};
			/**
			 * Méthode de défintion d'une vue pour une section donnée
			 *
			 * @param string le nom de la section de la vue
			 * @param string le code de la vue
			 * @return bool true
			 */
			this.setViewForSection = function setViewForSection(/*string*/$_section,/*string*/$_viewCode)
			{
				if (!isset(this.getViews()[$_section]))
				{
					this.getViews()[$_section] = new Array();
					this.getViews()[$_section][this.TPL_IN] = new String();
					this.getViews()[$_section][this.TPL_OUT] = new String();
				}
				this.getViews()[$_section][this.TPL_IN] = $_viewCode;
				return this.displayLog('setViewForSection', [ $_section, $_viewCode ], false);
			};
			/**
			 * Méthode d'ajout d'une vue au tableau des vues.
			 * Le paramétre vue doit étre un tableau de la forme :
			 *	- section => nom de la section
			 *	- view => code de la vue
			 *
			 * @param array les informations concernant la vue
			 * @return bool true
			 */
			this.addToViews = function addToViews(/*array*/$_view)
			{
				this.displayLog('addToViews', $_view, false);
				if (isset($_view['section']) && isset($_view['view']))
					return this.addViewToSection($_view['section'], $_view['view']);
				else
					return !this.displayLog('addToViews', 'Il faut définir section et view dans le tableau : ' + $_view, true);
			};
			/**
			 * Méthode de définition de la section
			 *
			 * @string le nom de la section
			 * @return bool true si la section existe dans les vues|false sinon
			 */
			this.setSection = function setSection(/*string*/$_section)
			{
				if (keyInArray($_section, this.getViews()))
				{
					this.section = $_section;
					return this.displayLog('setSection', $_section, false);
				}
				else
					return !this.displayLog('setSection', 'La section "' + $_section + '" n\'existe pas dans les vues', true);
			};
			/**
			 * Méthode d'application de la valeur d'un élément du template
			 * Il faut auparavant définir la section dans laquelle se trouve le template à utiliser.
			 * Pour cela, soit il faut appeler setSection afin de la sépcifier 
			 * ou passer à l'appel de cette méthode en dernier le nom de la section à utiliser
			 *
			 * Il est nécessaire de spécifier le nom de l'élément à replacer, la clef
			 * ainsi que la valeur par laquelle remplacer la clef
			 *
			 * @param string la clef de l'élément à remplacer
			 * @param string la valeur à utiliser
			 * @param string optional le nom de la section dasn laquelle se trouve le code template
			 * @return bool true
			 */
			this.applyValue = function applyValue(/*string*/$_key,/*string*/$_value/*string $_section*/)
			{
				if (isset(arguments[2]))
					this.setSection(arguments[2]);
				if (this.getKeyStart() == '')
					return !this.displayLog('applyValue', 'Il est indispensable de définir la symbole de début');
				if (this.getKeyEnd() == '')
					return !this.displayLog('applyValue', 'Il est indispensable de définir la symbole de fin');
				if (this.getSection() == '')
					return !this.displayLog('applyValue', 'Il est indispensable de définir la section dans laquelle charger le template');
				if (this.getSection() != '' && isset(this.getViews()[this.getSection()]))
				{
					/**
					 * Clef à remplacer
					 */
					var key = new String(this.getKeyStart() + $_key + this.getKeyEnd());
					var keyLength = key.length;
					/**
					 * Code dans lequel remplacer la clef
					 */
					if (this.getViews()[this.getSection()][this.TPL_OUT] == '')
						var code = new String(this.getViews()[this.getSection()][this.TPL_IN]);
					else
						var code = new String(this.getViews()[this.getSection()][this.TPL_OUT]);
					var codeLength = code.length;
					/**
					 * Valeur à utiliser
					 */
					var value = new String($_value);
					var valueLength = value.length;
					/**
					 * Index de parcoure
					 */
					var indexKey = code.indexOf(key);
					while (indexKey > 0 && indexKey < codeLength)
					{
						var codeBeforeKey = new String(code.substr(0, indexKey));
						var codeAfterKey = new String(code.substring(indexKey + keyLength));
						code = new String(codeBeforeKey + value + codeAfterKey);
						indexKey = code.toString().indexOf(key);
					}
					this.getViews()[this.getSection()][this.TPL_OUT] = code.toString();
					return this.displayLog('applyValue', this.getViews()[this.getSection()], false);
				}
				else
					return !this.displayLog('applyValue', 'Définir la section! : "' + this.getSection() + '" et/ou la vue pour la section! "' + this.getViews()[this.getSection()] + '"', true);
			};
			/**
			 * Méthdode d'initialisation des éléments de l'interface de l"objet, c'est-à-dire que l'on récupére les objet de l'interface
			 * @return
			 */
			this.initDoms = function initDoms()
			{
				var a = true;
				for ( var domId in this.getDoms())
					a &= this.initDom(domId);
				return this.displayLog('initDoms', 'Fin de la méthode', a);
			};
			/**
			 * Méthode d'initialisation d'un élément de l'interface par rapport à son id
			 * @param $_domId string l'id
			 * @return
			 */
			this.initDom = function initDom($_domId)
			{
				var el = this.get($_domId);
				if (isset(el))
				{
					/**
					 * Si l'élément n'est pas déjé pris en charge par la classe
					 */
					if (!isset(this.getElementOfDomsAt($_domId)))
						this.addToDoms($_domId, Array());
					addValueToArray(this.getDoms()[$_domId], el, this.DOM_EL);
					var value = this.getDomValue($_domId);
					addValueToArray(this.getDoms()[$_domId], isset(value) ? value : '', this.OLD_VALUE);
					addValueToArray(this.getDoms()[$_domId], isset(value) ? value : '', this.EL_VALUE);
					this.displayLog('initDom', 'Enregistrement de l\'élément HTML d\'id "' + $_domId + '"');
				}
				else
					this.displayLog('initDom', 'Erreur de récupération de l\'élément HTML d\'id "' + $_domId + '"', true);
			};
			/**
			 * Méthode de récupération de la valeur en cours de l'élément HTML pris en charge par l'objet de vue
			 * @return mixed
			 */
			this.getDomValue = function getDomValue($_domId)
			{
				var el = this.getDom($_domId);
				if (isset(el))
					return getFieldValue(null, el);
				else
					return null;
			};
			/**
			 * Méthode permettant de définir al valeur d'un élément HTML de l'interface
			 * @param $_domId string|HTMLElement id de l'élément html|élément HTML
			 * @param $_value mixed la valeur de l'élément HTML
			 * @return bool true|false
			 */
			this.setDomValue = function setDomValue($_domId, $_value)
			{
				var el = this.getDom($_domId);
				if (isset(el))
					return this.displayLog('setDomValue', 'Id "' + $_domId + '" de l\'élément OK pour "' + $_value + '"', !setFieldValue(el, $_value));
				else
					return !this.displayLog('setDomValue', 'Id "' + $_domId + '" de l\'élément non reconnu pour "' + $_value + '"', true);
			};
			/**
			 * Méthode de récupération de l'objet représentant l'élément HTML de l'interface enregistré dans l'objet
			 * @param $_domId string l'id de l'élément HTML de l'interface
			 * @return HTMLElement|null
			 */
			this.getDom = function getDom($_domId)
			{
				var el = this.getElementOfDomsAt($_domId);
				if (isset(el) && keyInArray(this.DOM_EL, el))
					return el[this.DOM_EL];
				else
				{
					if (isset(DOM))
						return DOM.get($_domId);
					else
						return null;
				}
			};
			/**
			 * Méthode permettant d'ajouter un événement sur un élément HTML pris en charge par l'objet d'interface
			 * @param $_domId string
			 * @param $_eventName string
			 * @param $_methodName string
			 * @param $_onElemnt bool
			 * @return
			 */
			this.addDomEvent = function addDomEvent($_domId, $_eventName, $_methodName/*,bool $_onElemnt*/)
			{
				var dom = this.getElementOfDomsAt($_domId);
				var el = this.getDom($_domId);
				if (isset(el) && (!keyInArray($_eventName, dom) || (keyInArray($_eventName, dom) && isFalse(dom[$_eventName]))))
				{
					/**
					 * Création de la fonction de mappage vers la méthode de l'objet
					 */
					var functionName = $_methodName + 'F';
					var functionPrototype = 'window.' + functionName + ' = function ' + functionName + '($_event,$_scope) { ' + this.getName() + '.' + $_methodName + '($_scope); }';
					var fonction = eval(functionPrototype);
					EVENT.purgeElement($_domId, false, $_eventName);
					var eventAdded = EVENT.addListener($_domId, $_eventName, fonction, $_domId);
					addValueToArray(dom, eventAdded, $_eventName);
					if (isTrue(arguments[3]))
					{
						var event = 'on' + $_eventName;
						DOM.get(el).setAttribute(event, 'return ' + arguments[3] + ';');
					}
					return this.displayLog('addDomEvent', 'Ajout de l\'événement "' + $_eventName + '" pour l\'élément "' + $_domId + '" avec la fonction "' + functionName + '"', !eventAdded);
				}
				else
					return !this.displayLog('addDomEvent', 'L\'élément n\'est pas défini ou l\'événement est déjé défini', true);
			};
			/**
			 * Méthode alias pour YAHOO.util.Dom.get
			 * @param $_domId string l'id de l'élément HTML
			 * @return HTMLElement|null
			 */
			this.get = function get($_domId)
			{
				if (isset(DOM))
					return DOM.get($_domId);
				else
					return document.getElementById($_domId);
			};
			/**
			 * Méthode d'ajout d'un class css sur un élément HTML par son id
			 * @param $_domId string l'id de l'élément
			 * @param $_class string le nouveau clas css
			 * @return bool true|false
			 */
			this.addClass = function addClass($_domId, $_class)
			{
				var el = DOM.get($_domId);
				if (isset(el))
					return this.displayLog('addClass', 'Ajout du class "' + $_class + '" sur l\'élément "' + $_domId + '"', !DOM.addClass(el, $_class));
				else
					return !this.displayLog('addClass', 'Erreur sur l\'élément "' + $_domId + '"', true);
			};
			/**
			 * Méthode de test d'un class css sur un élément
			 * @param $_domId string l'id de l'élément
			 * @param $_class string le class css à tester
			 * @return bool true|false
			 */
			this.hasClass = function hasClass($_domId, $_class)
			{
				var el = DOM.get($_domId);
				if (isset(el))
					return DOM.hasClass(el, $_class);
				else
					return !this.displayLog('addClass', 'Erreur sur l\'élément "' + $_domId + '"', true);
			};
			/**
			 * Méthode d'ajout d'un class css sur un élément HTML par son id
			 * @param $_domId string l'id de l'élément
			 * @param $_class string le nouveau clas css
			 * @return bool true|false
			 */
			this.removeClass = function removeClass($_domId, $_class)
			{
				var el = DOM.get($_domId);
				if (isset(el))
					return this.displayLog('removeClass', 'Suppression du class "' + $_class + '" sur l\'élément "' + $_domId + '"', !DOM.removeClass(el, $_class));
				else
					return !this.displayLog('removeClass', 'Erreur sur l\'élément "' + $_domId + '"', true);
			};
			/**
			 * Méthode permettant de définir le style d'un élément HTML
			 * @param $_domId string l'id de l'élément
			 * @param $_styleName string le nom de la propriété
			 * @param $_styleValue string la valeur de la propriété
			 * @return bool true|false
			 */
			this.setStyle = function setStyle($_domId, $_styleName, $_styleValue)
			{
				return this.get($_domId) ? (this.get($_domId).style[$_styleName] = $_styleValue) : false;
			};
			/**
			 * Méthode permettant d'afficher un élément en block
			 * @param $_domId string l'id de l'élément
			 * @return bool true|false
			 */
			this.displayBlock = function displayBlock($_domId)
			{
				return this.setStyle($_domId, 'display', 'block');
			};
			/**
			 * Méthode permettant d'afficher un élément en inline
			 * @param $_domId string l'id de l'élément
			 * @return bool true|false
			 */
			this.displayInline = function displayInline($_domId)
			{
				return this.setStyle($_domId, 'display', 'inline');
			};
			/**
			 * Méthode permettant de masquer un élément en none
			 * @param $_domId string l'id de l'élément
			 * @return bool true|false
			 */
			this.displayNone = function displayNone($_domId)
			{
				return this.setStyle($_domId, 'display', 'none');
			};
			/**
			 * Méthode permettant de recupérer tous les éléments du type passé en premier paramétre dans un élément HTML d'id passé en paramétre
			 * @param $_tagName string le type des éléments à retourner
			 * @param $_domId string l'id de l'élément HTML demande contenir les éléments demandés
			 * @param $_type string le type de l'élément HTML (pour les input principalement)
			 * @return array|null
			 */
			this.getElsOf = function getElsOf($_tagName, $_domId, $_type)
			{
				this.displayLog('getElsOf', Array($_tagName, $_domId, $_type));
				var el = this.get($_domId);
				var els = null;
				if (isset(el))
				{
					var elements = el.getElementsByTagName(new String($_tagName).toUpperCase());
					els = new Array();
					for ( var index in elements)
					{
						var element = elements[index];
						if (isObject(element) && this.get(element) && ((isset($_type) && element.type == $_type) || !isset($_type)))
							addValueToArray(els, element, element.id);
					}
				}
				return els;
			};
			/**
			 * Méthode de définition de l'entrée du menu sélectionnée
			 * @param $_entry string l'id de l'entrée du menu
			 * @return bool true
			 */
			this.setMenuEntry = function setMenuEntry($_entry)
			{
				/**
				 * Gestion des statistiques de parcourt du site
				 */
				if (this.getGooglePageTracker() && inArray(location.hostname, Array('www.niouseo.com', 'www.niouseo.net', 'www.niouseo.fr')))
				{
					try
					{
						if (isset($_entry))
							this.getGooglePageTracker()._trackPageview('/' + $_entry);
						else
							this.getGooglePageTracker()._trackPageview();
					}
					catch (e)
					{
						this.displayLog('setMenuEntry', e, true);
					}
				}
				return this.displayLog('setMenuEntry', $_entry, !this.setHashValue(this.MENU_ENTRY_IDENTIFICATOR, $_entry));
			};
			/**
			 * Méthode permettant de récupérer la valeur sélectionné dans le menu
			 * @return string|null
			 */
			this.getMenuEntry = function getMenuEntry($_fromHash)
			{
				var menuEntry = this.getAddedCookie(this.MENU_ENTRY_IDENTIFICATOR);
				if (!isset(menuEntry) || isTrue($_fromHash))
					menuEntry = this.getHashValue(this.MENU_ENTRY_IDENTIFICATOR);
				return menuEntry;
			};
			/**
			 * Méthode de gestion de l'appui sur le sous-menu
			 * @param $_domId string id de l'entrée du sous-menu
			 * @return bool true
			 */
			this.manageSubMenu = function manageSubMenu($_domId)
			{
				/**
				 * Définition de l'url
				 */
				this.setSubMenuEntry($_domId);
				return this.displayLog('manageSubMenu', $_domId);
			};
			/**
			 * Méthode de définition de l'entrée du menu sélectionnée
			 * @param $_entry string l'id de l'entrée du menu
			 * @return bool true
			 */
			this.setSubMenuEntry = function setSubMenuEntry($_entry)
			{
				/**
				 * "Forcage" de l'affichage du bon contenu
				 */
				if (isset(this.getYuiMenu()))
					this.getYuiMenu().set('activeIndex', this.getSubMenuIndex($_entry));
				/**
				 * Gestion des statistiques de parcourt du site
				 */
				if (this.getGooglePageTracker() && inArray(location.hostname, Array('www.niouseo.com', 'www.niouseo.net', 'www.niouseo.fr')))
				{
					try
					{
						if (isset($_entry))
							this.getGooglePageTracker()._trackPageview('/' + this.getMenuEntry() + '/' + $_entry);
						else
						{
							if (isset(this.getMenuEntry()))
								this.getGooglePageTracker()._trackPageview('/' + this.getMenuEntry());
						}
					}
					catch (e)
					{
						this.displayLog('setMenuEntry', e, true);
					}
				}
				this.addCookieValue(this.MENU_ENTRY_IDENTIFICATOR, this.getMenuEntry(true));
				this.addCookieValue(this.SUB_MENU_ENTRY_IDENTIFICATOR, $_entry);
				return this.displayLog('setSubMenuEntry', $_entry, !this.setHashValue(this.SUB_MENU_ENTRY_IDENTIFICATOR, $_entry));
			};
			/**
			 * Méthode de récupération de l'objet de suivi des pages vues par les visiteurs avec google analytics
			 * @return GooglePageTracker
			 */
			this.getGooglePageTracker = function getGooglePageTracker()
			{
				if (typeof pageTracker != 'undefined')
					return pageTracker;
				else
					return this.initGooglePageTracker();
			};
			/**
			 * Méthode d'initialisation du GooglePageTracker
			 * @return GooglePageTracker
			 */
			this.initGooglePageTracker = function initGooglePageTracker()
			{
				try
				{
					if (typeof _gat != 'undefined' && isFunction(_gat._getTracker))
						return _gat._getTracker('UA-4124721-3');
					else
						return null;
				}
				catch (e)
				{
					this.displayLog('initGooglePageTracker', e, true);
					return null;
				}
			};
			/**
			 * Méthode permettant de faire afficher le contenu du premier onglet
			 * @return bool true
			 */
			this.displayFirstTab = function displayFirstTab()
			{
				if (isset(this.getYuiMenu()))
				{
					/**
					 * Mise en évidence CSS de l'entrée du menu
					 */
					var as = this.getElsOf('A', this.SIDEBAR_ZONE);
					/**
					 * Récupération de l'id de la premiére entrée du menu
					 */
					var firstId = null;
					for ( var aId in as)
						firstId = isset(firstId) ? firstId : aId;
					return this.displayLog('displayFirstTab', 'Appel de la méthode', !this.setSubMenuEntry(firstId));
				}
				else
					return this.displayLog('displayFirstTab', 'Appel de la méthode');
			};
			/**
			 * Méthode permettant de récupérer la valeur sélectionné dans le menu
			 * @return string|null
			 */
			this.getSubMenuEntry = function getSubMenuEntry()
			{
				var subMenuEntry = this.getHashValue(this.SUB_MENU_ENTRY_IDENTIFICATOR);
				if (!isset(subMenuEntry))
					subMenuEntry = this.getAddedCookie(this.SUB_MENU_ENTRY_IDENTIFICATOR);
				return subMenuEntry;
			};
			/**
			 * Méthode permettant de récupérer l'index numéraire de la position d'une entrée du sous-menu
			 * @param $_domId string l'id du lien
			 * @return inde|null
			 */
			this.getSubMenuIndex = function getSubMenuIndex($_domId)
			{
				var links = this.getElsOf('A', this.SIDEBAR_ZONE);
				var cpt = 0;
				if (isset($_domId))
				{
					for ( var index in links)
					{
						if (this.get(links[index]) && isset(links[index].id) && index == $_domId)
							break;
						else
							cpt++;
					}
				}
				this.displayLog('getSubMenuIndex', Array($_domId, cpt));
				return cpt;
			};
			/**
			 * Méthode permettant d'afficher le message par défaut indiquant un enregistrement cours.
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true
			 */
			this.showSaving = function showSaving()
			{
				return this.showWaiting(isset(arguments[0]) ? arguments[0] : null, this.getOTr().get('SAVING_TITLE'), '');
			};
			/**
			 * Méthode permettant d'afficher le message par défaut indiquant une création cours.
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true
			 */
			this.showCreating = function showCreating()
			{
				return this.showWaiting(isset(arguments[0]) ? arguments[0] : null, this.getOTr().get('CREATING_TITLE'), '');
			};
			/**
			 * Méthode permettant d'afficher le message par défaut indiquant un chargement de données cours.
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true
			 */
			this.showLoading = function showLoading()
			{
				return this.showWaiting(isset(arguments[0]) ? arguments[0] : null, this.getOTr().get('LOADING_TITLE'), '');
			};
			/**
			 * Méthode permettant d'afficher le message par défaut indiquant une suppression de données cours.
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true
			 */
			this.showDeleting = function showDeleting()
			{
				return this.showWaiting(isset(arguments[0]) ? arguments[0] : null, this.getOTr().get('DELETING_TITLE'), '');
			};
			/**
			 * Méthode permettant d'afficher le message par défaut indiquant une mise à jour de données cours.
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true
			 */
			this.showUpdating = function showUpdating()
			{
				return this.showWaiting(isset(arguments[0]) ? arguments[0] : null, this.getOTr().get('UPDATING_TITLE'), '');
			};
			/**
			 * Méthode permettant d'afficher le message par défaut indiquant une vérification de données cours.
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true
			 */
			this.showChecking = function showChecking()
			{
				return this.showWaiting(isset(arguments[0]) ? arguments[0] : null, this.getOTr().get('CHECKING_TITLE'), '');
			};
			/**
			 * Méthode permettant d'afficher le message par défaut indiquant un rafraichissemnt de l'interface
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true
			 */
			this.showRefreshing = function showRefreshing()
			{
				return this.showWaiting(isset(arguments[0]) ? arguments[0] : null, this.getOTr().get('REFRESHING_TITLE'), '');
			};
			/**
			 * Méthode générique permettant d'afficher le message par défaut indiquant une attente.
			 * Cela permet de bloquer toute action sur l'interface et de rendre l'attente dynamique et informative
			 * @return bool true|false
			 */
			this.showWaiting = function showWaiting($_domId, $_title, $_content)
			{
				var title = $_title;
				var content = $_content != "" ? $_content : "<img src=\"http://us.i1.yimg.com/us.yimg.com/i/us/per/gr/gp/rel_interstitial_loading.gif\" />";
				if (!isset(this.getLoading()) && isset(title) && isset(content))
				{
					var waitingZone = this.WAITING_ZONE;
					var loadingZone = isset($_domId) ? $_domId : this.LOADING_ZONE;
					var loading = new YAHOO.widget.Panel(waitingZone, { width : "auto", fixedcenter : true, close : false, draggable : false, zindex : 9999, modal : false, visible : true, effect : { effect : YAHOO.widget.ContainerEffect.FADE, duration : 0.5 } });
					loading.setHeader(title);
					loading.setBody(content);
					loading.render(loadingZone);
					loading.show();
					this.setLoading(loading);
					return this.displayLog('showWaiting', 'Chargement affiché dans l\'élément : ' + $_domId);
				}
				else
				{
					if (isset(title) && isset(content))
					{
						this.getLoading().setHeader(title);
						this.getLoading().setBody(content);
						return !this.displayLog('showWaiting', 'Chargement déjé affiché');
					}
					else
						return !this.displayLog('showWaiting', 'Pas de titre ou de contenu', true);
				}
			};
			/**
			 * Méthode de masquage du chargement de données
			 * @return bool true|false
			 */
			this.hideWaiting = function hideWaiting()
			{
				if (isset(this.getLoading()))
				{
					this.getLoading().hide();
					this.getLoading().destroy();
					return this.displayLog('hideWaiting', 'Chargement masqué', !this.setLoading(null));
				}
				else
					return !this.displayLog('hideWaiting', 'Chargement déjé masqué');
			};
			/**
			 * Méthode d'affichage d'un alert pour alerter l'utilisateur d'une erreur ou autre
			 * @param $_title string le titre de l'alerte
			 * @param $_content string le détail de l'alerte
			 * @return bool true
			 */
			this.showAlert = function showAlert($_title, $_content)
			{
				if (!isset(this.getAlert()))
				{
					var handleYes = this.handleAlertYes;
					var alertZone = this.ALERT_ZONE_ID;
					var me = this;
					this.setAlert(new YAHOO.widget.SimpleDialog(alertZone, { 'visible' : true, 'zIndex' : 9999, 'close' : false, 'fixedcenter' : true, 'modal' : true, 'draggable' : false, 'constraintoviewport' : true, 'icon' : YAHOO.widget.SimpleDialog.ICON_WARN, 'buttons' : [ { 'text' : me.getOTr().get('OK'), 'handler' : { 'fn' : handleYes, 'obj' : me, 'scope' : this }, 'isDefault' : true } ] }));
					this.getAlert().setHeader($_title);
					this.getAlert().setBody('<span class="popinAlertContent">' + $_content + '</span>');
					this.getAlert().render(this.ALERT_ZONE);
					return this.displayLog('showAlert', 'Affichage de l\'alerte');
				}
				else
				{
					if (isset($_title) && isset($_content))
					{
						this.getAlert().setHeader($_title);
						this.getAlert().setBody('<span class="yui-icon warnicon"></span><span class="popinAlertContent">' + $_content + '</span>');
						this.getAlert().render(this.ALERT_ZONE);
						return !this.displayLog('showAlert', 'Alert déjé affiché');
					}
					else
						return !this.displayLog('showAlert', 'L\'alerte est déjé affiché', true);
				}
			};
			/**
			 * Méthode de gestion de l'appui sur le bouton de validation de l'alerte
			 * @return bool true|false
			 */
			this.handleAlertYes = function handleAlertYes()
			{
				if (isset(this.getAlert()))
				{
					this.getAlert().hide();
					this.getAlert().destroy();
					return this.displayLog('handleAlertYes', 'Masquage de l\'alert', !this.setAlert(null));
				}
				else
					return !this.displayLog('handleAlertYes', 'Alert déjé masqué', true);
			};
			/**
			 * Méthode d'affichage d'une popin de confirmation d'une action requiérant l'attention de l'utilisateur
			 * @param $_title string le titre de la popin
			 * @param $_content string le message de la popin
			 * @param $_callbackObject Object l'aobjet à rappeler
			 * @param $_callbackMethodName string le nom de la méthode à rappeler lors de la confirmation/annulation par l'utilisateur
			 * @param $_methodParameter string le paramétre à passer à la méthode de la classe
			 * @return bool true|false
			 */
			this.showConfirmBox = function showConfirmBox($_title, $_content, $_callbackObject, $_callbackMethodName, $_methodParameter)
			{
				if (!isset(this.getConfirmBox()))
				{
					var handleYes = this.handleConfirmYes;
					var handleNo = this.handleConfirmNo;
					var confirmZone = this.CONFIRM_BOX_ZONE_ID;
					var me = this;
					var object = { 'object' : $_callbackObject, 'method' : $_callbackMethodName, 'parameter' : $_methodParameter };
					this.setConfirmBox(new YAHOO.widget.SimpleDialog(confirmZone, { 'visible' : true, 'zIndex' : 9999, 'close' : false, 'fixedcenter' : true, 'modal' : true, 'draggable' : false, 'constraintoviewport' : true, 'icon' : YAHOO.widget.SimpleDialog.ICON_HELP, 'buttons' : [ { 'text' : me.getOTr().get('VALIDATE'), 'handler' : { 'fn' : handleYes, 'obj' : object, 'scope' : this }, 'isDefault' : true }, { 'text' : me.getOTr().get('CANCEL'), 'handler' : { 'fn' : handleNo, 'obj' : object, 'scope' : this } } ] }));
					this.getConfirmBox().setHeader($_title);
					this.getConfirmBox().setBody('<span class="popinConfirmContent">' + $_content + '</span>');
					this.getConfirmBox().render(this.CONFIRM_BOX_ZONE);
					return this.displayLog('showConfirmBox', 'Affichage de l\'alerte');
				}
				else
				{
					if (isset($_title) && isset($_content))
					{
						this.getConfirmBox().setHeader($_title);
						this.getConfirmBox().setBody('<span class="yui-icon hlpicon"></span><span class="popinConfirmContent">' + $_content + '</span>');
						this.getConfirmBox().render(this.CONFIRM_BOX_ZONE);
						return !this.displayLog('showConfirmBox', 'Chargement déjé affiché');
					}
					else
						return !this.displayLog('showConfirmBox', 'L\'alerte est déjé affiché', true);
				}
			};
			/**
			 * Méthode de gestion du clic sur la confirmation de l'action par l'utilisateur
			 * @param $_event Event évenement généré
			 * @param $_object Object l'objet passé lors de l'appel de la confirmation afin de rappeler la méthode ayant généré la demande de confirmation
			 * @return bool true|false
			 */
			this.handleConfirmYes = function handleConfirmYes($_event, $_object)
			{
				return this.displayLog('handleConfirmYes', $_object, !this.finishConfirmBox($_object.object, $_object.method, $_object.parameter, true));
			};
			/**
			 * Méthode de gestion du clic sur l'annulation de l'action par l'utilisateur
			 * @param $_event Event évenement généré
			 * @param $_object Object l'objet passé lors de l'appel de la confirmation afin de rappeler la méthode ayant généré la demande de confirmation
			 * @return bool true|false
			 */
			this.handleConfirmNo = function handleConfirmNo($_event, $_object)
			{
				return this.displayLog('handleConfirmYes', $_object, !this.finishConfirmBox($_object.object, $_object.method, $_object.parameter, false));
			};
			/**
			 * Méthode générique de gestion de la popin de confirmations/annulation d'action par l'utilisateur
			 * @param $_object Object l'objet à rappeler
			 * @param $_methodName string la méthode de l'objet à rappeler
			 * @param $_methodParams string la méthode de l'objet à rappeler
			 * @param $_paramValue string la paramétre à passer en premier à la méthode
			 * @param $_value bool la valeur à passer lors de l'appel
			 * @return bool true|false
			 */
			this.finishConfirmBox = function finishConfirmBox($_object, $_methodName, $_paramValue, $_value)
			{
				if (isset(this.getConfirmBox()))
				{
					if (isObject($_object) && isString($_methodName))
					{
						/**
						 * Masquage de la popin
						 */
						this.getConfirmBox().hide();
						this.getConfirmBox().destroy();
						this.setConfirmBox(null);
						/**
						 * Tentative de l'appel de la méthode avec la valeur
						 */
						try
						{
							return this.displayLog('finishConfirmBox', 'Appel de la méthode "' + $_methodName + '" de l\'objet "' + $_object + '" avec le paramétre "' + $_paramValue + '" pour la valeur "' + $_value + '"', !$_object[$_methodName]($_paramValue, $_value));
						}
						catch (e)
						{
							return !this.displayLog('finishConfirmBox', 'Erreur lors de la tentative d\'appel de la méthode "' + $_methodName + '" de l\'objet "' + $_object + '" avec le paramétre "' + $_paramValue + '" pour la valeur "' + $_value + '" : "' + e + '"', true);
						}
					}
					else
						return !this.displayLog('finishConfirmBox', Array($_object, $_methodName, $_paramValue, $_value), true);
				}
				else
					return !this.displayLog('finishConfirmBox', 'Confirm déjé masqué', true);
			};
			/**
			 * Méthode de validation d'un formulaire selon les spécifications de la fonction FIC_checkForm dans le fichier FormValidator.js des communs
			 * @param $_formId string id du formulaire
			 * @return bool true si le formulaire a bien été validé|false dans le cas contraire
			 */
			this.validateForm = function validateForm($_formId)
			{
				var valid = FIC_checkForm($_formId);
				if (isTrue(valid))
				{
					(typeof document.querySelector != 'undefined')?this.displayNone(document.querySelector('#' + $_formId + ' .form_validation_errors')):null;
					return this.displayLog('validateForm', 'Formulaire correctement saisi');
				}
				else
				{
					(typeof document.querySelector != 'undefined')?this.setDomValue(document.querySelector('#' + $_formId + ' .form_validation_errors'), this.getOTr().get('FORM_VALIDATION_FAILED_CONTENT') + '<a id="cancel_form" class="cancel_form_' + $_formId + '" onclick="onClickF(this,event);return false;" title="' + this.getOTr().get('CANCEL') + '"></a>'):null;
					(typeof document.querySelector != 'undefined')?this.displayBlock(document.querySelector('#' + $_formId + ' .form_validation_errors')):null;
					return !this.displayLog('validateForm', 'Des erreurs sont apparues lors de la vérification du formulaire', true);
				}
			};
			/**
			 * Méthode permettant d'annuler la soumission d'un formulaire, 
			 * c'est-à-dire de supprimer la mise en évidence des champs erronnés/validés 
			 * @return bool true|false
			 */
			this.cancelForm = function cancelForm($_formId)
			{
				/**
				 * Suppression mise en évidence
				 */
				if (this.get($_formId))
				{
					/**
					 * Sur les champs
					 */
					var elements = this.get($_formId).elements;
					var nbElements = elements.length;
					for ( var i = 0; i < nbElements; i++)
					{
						var element = elements.item(i);
						if (element)
						{
							this.removeClass(element, this.VALID_PASSED);
							this.removeClass(element, this.VALID_FAILED);
						}
					}
					/**
					 * Sur les labels
					 */
					var labels = this.get($_formId).getElementsByTagName('label');
					var nbLabels = labels.length;
					for ( var i = 0; i < nbLabels; i++)
					{
						var label = labels.item(i);
						if (label)
						{
							this.removeClass(label, 'valid');
							this.removeClass(label, 'error');
						}
					}
					/**
					 * Masquage message
					 */
					this.displayNone((typeof document.querySelector != 'undefined')?document.querySelector('#' + $_formId + ' .form_validation_errors'):null);
					return this.displayLog('cacnelForm', $_formId);
				}
				else
					return this.displayLog('cacnelForm', $_formId, true);
			};
			/**
			 * Méthode permettant de mettre en erreur un élément HTML par les class de mise en évidence de champs erronés
			 * @param $_domId string l'id de l'élément HTML ou l'élément HTML
			 * @return
			 */
			this.errorField = function errorField($_domId)
			{
				this.removeClass($_domId, this.VALID_PASSED);
				this.addClass($_domId, this.VALID_FAILED);
				return this.displayLog('errorField', $_domId);
			};
			/**
			 * Méthode permettant de mettre en évidence le fait que l'élément HTML est validé par les class de mise en évidence de champs validés
			 * @param $_domId string l'id de l'élément HTML ou l'élément HTML
			 * @return
			 */
			this.validField = function validField($_domId)
			{
				this.removeClass($_domId, this.VALID_FAILED);
				this.addClass($_domId, this.VALID_PASSED);
				return this.displayLog('validField', $_domId);
			};
			/**
			 * Méthode chargée d'afficher le contenu du sous-menu en se basant sur l'attribut subMenuContent de la classe.
			 * Si le contenu est à null, alors il ne sera rien afficher.
			 * 
			 * @return bool true|false
			 */
			this.displaySubMenu = function displaySubMenu()
			{
				if (isset(this.getSubMenuContent()))
				{
					/**
					 * On définit le contenu du sous-menu
					 */
					this.setDomValue(this.SIDEBAR_ZONE, this.getSubMenuContent());
					this.initYuiMenu();
					return this.displayLog('displaySubMenu', 'Affichage du sous-menu', !this.init());
				}
				else
					return !this.displayLog('displaySubMenu', 'Non affichage du sous-menu', true);
			};
			/**
			 * Méthode chargée d'afficher le contenu central
			 * @param bool indique s'il faut ou initialiser le menu
			 * @return bool true|false
			 */
			this.displayCentralContent = function displayCentralContent($_initYuiMenu)
			{
				if (isset(this.getCentralContent()))
				{
					/**
					 * On définit le contenu central
					 */
					this.setDomValue(this.CONTENT_ZONE, this.getCentralContent());
					if (isTrue($_initYuiMenu) || !isset($_initYuiMenu))
						this.initYuiMenu();
					return this.displayLog('displayCentralContent', 'Affichage du contenu central', !this.init());
				}
				else
					return !this.displayLog('displayCentralContent', 'Non affichage du contenu central', true);
			};
			/**
			 * Méthode chargée de charger le contenu central
			 * @param $_mode string l'action à appeler pour charger le contenu du sous-menu
			 * @return bool true
			 */
			this.loadSubMenuContent = function loadSubMenuContent($_mode)
			{
				if (isset($_mode) && $_mode != '')
				{
					this.incrIndex();
					this.showLoading();
					this.defineCallback('loadSubMenuContentCallback');
					this.setNiouseoModeToCall($_mode);
					return this.displayLog('loadSubMenuContent', 'Chargement du contenu du sous-menu', !this.sendRequest());
				}
				else
					return !this.displayLog('loadSubMenuContent', 'Le paramétre $_mode n\'est pas défini', true);
			};
			/**
			 * Méthode de gestion de l'appel pour la récupération du contenu central
			 * @param $_r Object objet de la réponse
			 * @return bool true|false
			 */
			this.loadSubMenuContentCallback = function loadSubMenuContentCallback($_r)
			{
				if (this.decrIndex() == 0)
					this.hideWaiting();
				var content = this.rContent($_r);
				if (!this.rIsError($_r))
				{
					/**
					 * Définition du contenu du sous-menu
					 */
					this.setSubMenuContent(content);
					this.displaySubMenu();
					/**
					 * Affichage de l'onglet sélectionné
					 */
					if (this.getSubMenuEntry())
						this.setSubMenuEntry(this.getSubMenuEntry());
					/**
					 * On s'assure d'afficher le contenu du premier onglet
					 */
					else
						this.displayFirstTab();
					return this.displayLog('loadSubMenuContentCallback', $_r);
				}
				else
					return !this.displayLog('loadSubMenuContentCallback', $_r, true);
			};
			/**
			 * Méthode chargée de charger le contenu central de la page
			 * @param $_mode string mode de chargement de la vue centrale
			 * @return bool true
			 */
			this.loadCentralContent = function loadCentralContent($_mode)
			{
				if (isset($_mode) && $_mode != '')
				{
					this.showLoading();
					this.defineCallback('loadCentralContentCallback');
					this.setNiouseoModeToCall($_mode);
					this.incrIndex();
					return this.displayLog('loadCentralContent', 'Chargement du contenu central', !this.sendRequest());
				}
				else
					return this.displayLog('loadCentralContent', 'Le paramétre $_mode n\'est pas défini', true);
			};
			/**
			 * Méthode de gestion de l'appel pour la récupération du contenu central
			 * @param $_r Object objet de la réponse
			 * @return bool true|false
			 */
			this.loadCentralContentCallback = function loadCentralContentCallback($_r)
			{
				if (this.decrIndex() == 0)
					this.hideWaiting();
				var content = this.rContent($_r);
				if (!this.rIsError($_r))
				{
					/**
					 * Définition du contenu central
					 * 	- si content est un objet et qu'il contient la propriété html, 
					 * 		alors c'est cette propriété qui défini le contenu à affiché,
					 * 		la propriété js sera lors exécuté suite à l'affichage du contenu car il se base sur ce contenu html
					 * 	- si cotnent est une chaine de caractéres, alors c'est le contenu html à afficher simplement
					 */
					if (hasProperty(content, 'html'))
						this.setCentralContent(content.html);
					else
						this.setCentralContent(content);
					/**
					 * Affichage du contenu
					 */
					this.displayCentralContent(!hasProperty(content, 'js'));
					/**
					 * Si contenu conteient une ou des balises JS, on les déplace au head
					 */
					var scripts = this.getElsOf('script', this.CONTENT_ZONE);
					for ( var index in scripts)
					{
						try
						{
							eval(scripts[index].innerHTML);
						}
						catch (e)
						{
						}
					}
					/**
					 * Si la propriété js est définie
					 */
					if (hasProperty(content, 'js'))
					{
						this.manageCentralContentJs(content.js);
						/**
						 * Le JS modifiant le contenu central, on enregistre la nouvelle version du contenu central
						 */
						this.setCentralContent(this.getDomValue(this.CONTENT_ZONE));
						/**
						 * Initialisation du menu
						 */
						this.initYuiMenu();
					}
					return this.displayLog('loadCentralContentCallback', $_r);
				}
				else
					return !this.displayLog('loadCentralContentCallback', $_r, true);
			};
			/**
			 * Méthode générique de gestion du javascript retourné pour la partie centrale
			 * @param $_js mixed
			 * @return bool true
			 */
			this.manageCentralContentJs = function manageCentralContentJs($_js)
			{
				return this.displayLog('manageCentralContentJs', $_js);
			};
			/**
			 * Méthode permettant d'indiquer qu'il faut prendre en charge la vue actuelle.
			 * Elle doit alors définir le contenu du sous-menu et le contenu du central.
			 * Par défaut, le contenu central correspond à la premiére entrée du sous-menu. 
			 * @param $_subMenuLoadMode string mode à appeler pour charger le contenu du sous-menu
			 * @param $_contentLoadMode string mode à appeler pour charger le contenu central 
			 * @return bool true|false
			 */
			this.manageView = function manageView($_subMenuLoadMode, $_contentLoadMode)
			{
				if (this.getSubMenuContent() == '' && isset($_subMenuLoadMode) && this.getCentralContent() == '' && isset($_contentLoadMode))
				{
					this.loadSubMenuContent($_subMenuLoadMode);
					this.loadCentralContent($_contentLoadMode);
				}
				else
				{
					this.displaySubMenu();
					this.displayCentralContent(true);
				}
				return this.displayLog('manageView', Array('Prise en charge de la vue', $_subMenuLoadMode, $_contentLoadMode));
			};
			/**
			 * Méthode d'itinialisation du menu YUI si : 
			 * 	- le contenu central est défini
			 * 	- le contenu du sous-menu est défini
			 * 	- l'id du sous-menu est défini
			 */
			this.initYuiMenu = function initYuiMenu()
			{
				if (this.getSubMenuContent() != '' && this.getSubMenuContent() != '' && this.getSubMenuId() != '')
				{
					/**
					 * On affecte les bonnes classes au menu
					 */
					if (!this.hasClass(this.getSubMenuId(), this.YUI_TAB_MENU))
						this.addClass(this.getSubMenuId(), this.YUI_TAB_MENU);
					/**
					 * On affecte les bonnes classes au contenu
					 */
					if (!this.hasClass(this.CONTENT_ZONE, this.YUI_TAB_CONTENT))
						this.addClass(this.CONTENT_ZONE, this.YUI_TAB_CONTENT);
					/**
					 * On défini la sous-menu comme un menu Yahoo en charge du contenu central
					 */
					this.setYuiMenu(new YAHOO.widget.TabView(this.YUI_CONTENT_ID, { 'activeIndex' : 0 }));
					/**
					 * Liste des sous-menus
					 */
					var subMenuLinks = this.getElsOf('A', this.SIDEBAR_ZONE);
					if (isArray(subMenuLinks))
					{
						for ( var id in subMenuLinks)
						{
							if (isString(id))
							{
								this.initDom(id);
								this.addDomEvent(id, this.ON_CLICK, 'manageSubMenu');
								/**
								 * Si l'entrée du sous-menu avait été sélectionnée
								 */
								if (this.getSubMenuEntry() == id)
									this.manageSubMenu(id);
							}
							else
								this.addDomEvent(subMenuLinks[id], 'click', 'manageSubMenu');
						}
					}
					return this.displayLog('initYuiMenu', 'Initialisation du menu YUI');
				}
				else
					return !this.displayLog('initYuiMenu', 'Non initialisation du menu YUI', true);
			};
			/**
			 * Méthode retournant l'id du lien du menu pris en charge par la classe
			 * @return string
			 */
			this.getLinkId = function getLinkId()
			{
				return this.LINK_ID;
			};
			/**
			 * Méthode de définition de l'id du sous menu selon le nom de la classe
			 * @return bool true
			 */
			this.defineSubMenuId = function defineSubMenuId()
			{
				return this.displayLog('defineSubMenuId', 'Définition de l\'id du sous-menu en se basant sur le nom de la classe', !this.setSubMenuId(this.toString() + this.SUB_MENU_ID_SUFFIX));
			};
			/**
			 * Méthode permettant de soumettre un formulaire
			 * @param $_formId string l'id du formulaire à soumettre en ajax
			 * @param $_url string l'url de soumission du formulaire
			 * @param $_params object les paramétres à transmettre en plus
			 * @return bool true|false
			 */
			this.sendFormElements = function sendFormElements($_formId, $_url, $_params)
			{
				if (this.validateForm($_formId) && $_url != '')
				{
					if (!isset($_params.title) && isset(this.get($_formId).submit_form_title))
					{
						var title = this.getDomValue(this.get($_formId).submit_form_title);
						if (isset(title) && title != '')
							$_params.title = title;
					}
					this.showSaving($_params.title);
					var s = new N.Saver(this.getDisplayDebug());
					s.setUrl($_url);
					/**
					 * Gestion des éléments du formulaire
					 */
					var elements = this.get($_formId).elements;
					var nbElements = elements.length;
					for ( var i = 0; i < nbElements; i++)
					{
						var element = elements.item(i);
						if (isString(element.name))
							s.addToValues(element.name, getFieldValue(element.id));
					}
					/**
					 * Gestion des paramétres à transmettre
					 */
					for ( var paramName in $_params)
					{
						var paramValue = $_params[paramName];
						switch (paramName)
						{
							case 'context':
								s.setContext(paramValue);
								break;
							case 'callback':
								s.setCallback(paramValue);
								break;
							case 'httpMethod':
								s.setHttpMethod(paramValue);
								break;
							case 'callType':
								s.setCallType(paramValue);
								break;
							case 'output':
								s.setOutput(paramValue);
								break;
							default:
								s.addToValues(paramName, paramValue);
								break;
						}
					}
					return !this.displayLog('sendFormElements', 'Validation des informations du formulaire, envoi ajax', s.doRequest());
				}
				else
					return !this.displayLog('sendFormElements', 'Arrét suite à la non validation des informations du formulaire', true);
			};
			/**
			 * Méthode permettant de soumettre un formulaire de saisie simple
			 * @param $_formId string l'id du formulaire
			 * @param $_params array|objet les paramétres supléméntaires à transmettre
			 * @return^bool true|false
			 */
			this.submitForm = function submitForm($_formId, $_params)
			{
				return this.sendFormElements($_formId, this.getUrl(), $_params);
			};
			/**
			 * Méthode générqieude gestion des événements DOM
			 * @param $_scope HTMLElement
			 * @param $_event HTMLEvent
			 * @return bool true|false
			 */
			this.onDomEvent = function onDomEvent($_scope, $_event)
			{
				switch ($_scope.id)
				{
					case 'cancel_form':
						var formId = isset($_scope.className) ? $_scope.className.replace(/cancel_form_/, '') : null;
						if (isset(formId) && this.get(formId))
							return this.displayLog('onDomEvent', arguments, !this.cancelForm(formId));
						break;
				}
				return this.displayLog('onDomEvent', arguments);
			};
			/**
			 * Méthode d'instanciation de l'objet
			 *
			 * @param bool optional true|false pour activer le debug
			 * @return Viewer object
			 */
			this._construct = function _construct(/*bool $_DisplayDebug*/)
			{
				/**
				 * Nom de la l'objet
				 */
				N.registerProperty(this, 'VIEWER', 'Viewer');
				/**
				 * Clef d'enregistrement du template d'entrée
				 */
				N.registerProperty(this, 'TPL_IN', 'templateIn');
				/**
				 * Clef d'enregistrement du template de sortie aprés remplacement des clefs
				 */
				N.registerProperty(this, 'TPL_OUT', 'templateOut');
				/**
				 * Clef d'enregistrement de l'objet HTML dans l'objet doms
				 */
				N.registerProperty(this, 'DOM_EL', 'domEl');
				/**
				 * Clef d'enregistrement de la valeur l'objet HTML si c'est un élément de formulaire
				 */
				N.registerProperty(this, 'EL_VALUE', 'elValue');
				/**
				 * Clef d'enregistrement de la valeur l'objet HTML au chargement de la page si c'est une élément de formulaire
				 */
				N.registerProperty(this, 'OLD_VALUE', 'oldValue');
				/**
				 * Nom des zones de l'interface pouvant étre utilisées par plusieurs classes héritant de cette classe ou autre
				 */
				/**
				 * Zone du HEAD du body, la zone tout en haut
				 */
				N.registerProperty(this, 'HEAD_ZONE', 'head');
				/**
				 * Zone du header du site
				 */
				N.registerProperty(this, 'HEADER_ZONE', 'header');
				/**
				 * Zone du menu du site
				 */
				N.registerProperty(this, 'MENU_ZONE', 'menu');
				/**
				 * Indique l'entrée sélectionnée du menu 
				 */
				N.registerProperty(this, 'MENU_ENTRY_IDENTIFICATOR', 'Menu');
				/**
				 * Indique l'entrée sélectionnée du sous-menu 
				 */
				N.registerProperty(this, 'SUB_MENU_ENTRY_IDENTIFICATOR', 'SubMenu');
				/**
				 * Zone de la barre gauche du site
				 */
				N.registerProperty(this, 'SIDEBAR_ZONE', 'menu');
				/**
				 * Zone du contenu du site
				 */
				N.registerProperty(this, 'CONTENT_ZONE', 'contenu_content');
				/**
				 * Zone d'affichage de la popin de chargement
				 */
				N.registerProperty(this, 'LOADING_ZONE', document.body);
				/**
				 * Zone d'affichage de la popin d'alert
				 */
				N.registerProperty(this, 'ALERT_ZONE', document.body);
				/**
				 * Id de la popin d'alert
				 */
				N.registerProperty(this, 'ALERT_ZONE_ID', 'alert');
				/**
				 * Zone d'affichage de la popin de confirmation
				 */
				N.registerProperty(this, 'CONFIRM_BOX_ZONE', document.body);
				/**
				 * Id de la popin de confirmations
				 */
				N.registerProperty(this, 'CONFIRM_BOX_ZONE_ID', 'confirm');
				/**
				 * Id de la popin de chargement
				 */
				N.registerProperty(this, 'WAITING_ZONE', 'wait');
				/**
				 * Class css des éléments HTML de formulaire non validés
				 */
				N.registerProperty(this, 'VALID_FAILED', 'validation-failed');
				/**
				 * Class css des éléments HTML de formulaire validés
				 */
				N.registerProperty(this, 'VALID_PASSED', 'validation-passed');
				/**
				 * Class css des menus Yahoo
				 */
				N.registerProperty(this, 'YUI_TAB_MENU', 'yui-nav');
				/**
				 * Class css des contenus Yahoo associés au menu
				 */
				N.registerProperty(this, 'YUI_TAB_CONTENT', 'yui-content');
				/**
				 * Suffixe ajouté à l'id du sous-menu par rapport au nom de la classe utilisant la méthode defineSubMenuId
				 */
				N.registerProperty(this, 'SUB_MENU_ID_SUFFIX', 'SubMenu');
				/**
				 * Id du conteneur des onglets et contenus associés aux onglets
				 */
				N.registerProperty(this, 'YUI_CONTENT_ID', 'container');
				if (this.toString() == this.VIEWER)
					this.superclass._construct.apply(this, arguments);
				else
					this.getSuper()._construct.apply(this, arguments);
				this.initVars();
				this.addArrayOfParamsToSend(new Array({ 'type' : 'STRING', 'name' : 'subMenuId', 'getMethod' : 'this.getSubMenuId' }));
				this.displayLog('_construct', 'Init de ' + this.toString());
				return this;
			};
			this._construct(arguments[0]);
		};
		/**
		 * Héritage de la classe
		 */
		N.extend(Viewer, N.Caller);
		N.registerProperty(N, 'Viewer', Viewer);
	})();
}
