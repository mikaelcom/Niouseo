/**
 * @package Niouseo
 * @subpackage NiouseoEventManager
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
		 * Classe de gestion des événements d'un objet. 
		 * Il faut pouvoir définir plusieurs événements possibles que l'objet peut générer 
		 * Chacun des événements est associés à une clef (valeur) l'identifiant
		 * Lorsque l'événement est généré, il est généré par l'objet en cours et remonté au parent en charge de l'objet en cours.
		 * Il faut pouvoir associer une fonction (méthode d'objet) à un événement afin que celle-ci soit appelée. 
		 * Si la fonction (méthode d'objet) n'existe pas, alors c'est la fonction par défaut qui est appelée, permettant de faire remonter l'événement au parent de l'objet.
		 */
		var EventManager = function EventManager()
		{
			this.classInfo = { 'appName' : 'EventManager', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '07/12/08' };
			/**
			 * Initialisation des attributs de la classe
			 * @return bool true
			 */
			this.initVars = function initVars()
			{
				if (this.toString() == this.EVENTMANAGER)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				/**
				* Création des attributs de la classe et de leur méthode respectives
				 */
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendAttribute('events', []); //tableau des événements possibles de l'objet
			};
			/**
			 * Méthode renvoyant le nom de cette classe
			 *
			 * @return string gen
			 */
			this.toString = function toString()
			{
				return this.EVENTMANAGER;
			};
			/**
			 * Surcharge de la méthode par défaut afin de définir les événements comme des objets à part entiére
			 *
			 * @param $_index int|string l'index oé placé l'événément
			 * @param $_event string le nom de l'événement à enregistrer
			 */
			this.addToEvents = function addToEvents($_index, $_event)
			{
				try
				{
					eval('var event = function ' + $_index + '(){}');
				}
				catch (e)
				{
					return !this.displayLog('addToEvents', 'Erreur lors de l\'ajout de l\'événement :  "' + e + '"', true);
				}
				N.extend(event, N.NiouseoGen);
				event = new event(this.getDisplayDebug());
				event = event.getSuper()._construct.apply(event, Array(this.getDisplayDebug()));
				/** 
				 * Méthode renvoyant le nom de l'événement
				 * @return string
				 */
				event.toString = function toString()
				{
					return $_index;
				};
				event = event._construct();
				event.getSuper().initVars.apply(event);
				event.setParent(this);
				/**
				 * Information de l'objet
				 */
				event.classInfo = { 'appName' : 'Event_' + $_event, 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : getDateNow('DDMMYYYY', '/') + ' ' + getHourNow('HHMMSS', ':') };
				event.getAttributeFactory().setObject(event);
				event.getAttributeFactory().appendArrayOfAttributes(new Array({ 'name' : 'eventName', 'default' : $_event }, { 'name' : 'source', 'default' : '' }, { 'name' : 'target', 'default' : '' }, { 'name' : 'eventListeners', 'default' : [] }));
				event.setName($_index);
				this.getEvents()[$_event] = event;
				N.registerProperty(this, $_index, $_event);
				return this.displayLog('addToEvents', 'Ajout de l\'événement');
			};
			/**
			 * Méthode d'association d'une fonction à un événement
			 *
			 * @param string nom de l'événement (identifiant)
			 * @param string le nom de la fonction devant étre appelée lorsque l'événement est généré
			 * @return bool true si l'événement existe et la fonction existe|false dans le cas contraire
			 */
			this.addFunctionEventListener = function addFunctionEventListener($_event, $_function)
			{
				if (this.getElementOfEventsAt($_event) && isFunction($_function))
				{
					this.getElementOfEventsAt($_event).addToEventListeners(this.getElementOfEventsAt($_event).countEventListeners(), $_function);
					return this.displayLog('addFunctionToEvent', 'Définition de la fonction "' + $_function + '" pour l\'événement "' + $_event + '"');
				}
				else
				{
					if (!this.getElementOfEventsAt($_event))
						return !this.displayLog('addFunctionToEvent', 'L\'événement "' + $_event + '" n\'est pas défini', true);
					else
						return !this.displayLog('addFunctionToEvent', 'La fonction "' + $_function + '" n\'est pas définie', true);
				}
			};
			/**
			 * Méthode d'association d'une méthode d'objet à un événement
			 *
			 * @param string nom de l'événement (identifiant)
			 * @param object l'objet devant ayant la méthode devant étre appelée lors de l'événement
			 * @param string le nom de la méthode devant étre appelée
			 * @return bool true si l'événement existe et la fonction existe|false dans le cas contraire
			 */
			this.addMethodEventListener = function addMethodEventListener($_event, $_object, $_method)
			{
				if (this.getElementOfEventsAt($_event) && isObject($_object) && isset($_object[$_method]))
				{
					this.getElementOfEventsAt($_event).addToEventListeners($_object.getName() + '.' + $_method.toString(), $_object.getName() + '.' + $_method.toString());
					return this.displayLog('addFunctionToEvent', 'Définition de la fonction "' + $_function + '" pour l\'événement "' + $_event + '"');
				}
				else
				{
					if (!this.getElementOfEventsAt($_event))
						return !this.displayLog('addFunctionToEvent', 'L\'événement "' + $_event + '" n\'est pas défini', true);
					else
					{
						if (!isObject($_object))
							return !this.displayLog('addFunctionToEvent', 'L\'objet passé n\'est pas un objet', true);
						else
							return !this.displayLog('addFunctionToEvent', 'La méthode "' + $_method + '" n\'est pas définie', true);
					}
				}
			};
			/**
			 * Méthode de propagation d'un événement
			 *
			 */
			this.fireEvent = function fireEvent(/*string*/$_eventName/*,object $_scope,mixed $_args*/)
			{
				if (this.getElementOfEventsAt($_eventName))
				{
					try
					{
						var eventListeners = this.getElementOfEventsAt($_eventName).getEventListeners();
						for ( var eventListenerIndex in eventListeners)
						{
							var listener = this.getElementOfEventsAt($_eventName).getElementOfEventListenersAt(eventListenerIndex);
							listener(arguments[0], arguments[1], arguments[2]);
							/**
							 * On supprime le listener
							 */
							this.displayLog('fireEvent', 'Appel du listener pour "' + $_eventName + '"', !this.getElementOfEventsAt($_eventName).deleteElementOfEventListenersByIndex(eventListenerIndex));
						}
						return this.displayLog('fireEvent', 'Appel du listener pour "' + $_eventName + '"');
					}
					catch (e)
					{
						return !this.displayLog('fireEvent', 'Exception généré à l\'appel de la méthode de gestion des événements : "' + e + '" pour "' + $_eventName + '".', true);
					}
				}
				else
					return !this.displayLog('fireEvent', 'L\'événement "' + $_eventName + '" n\'est pas référencé en tant qu\'événement ou l\'écouteur de l\'événement n\'est pas une fonction', true);
			};
			/**
			 * Méthode de propagation d'un événement
			 *
			 * @param string l'identifiant de l'événement
			 * @param object l'objet qui a généré l'événement au moment de l'événement
			 * @return bool true
			 */
			this.expandEvent = function expandEvent(/*string*/$_event,/*object*/$_scope)
			{
				if (isset(this.getParent()))
					this.getParent().expandEvent($_event, $_scope);
				return this.displayLog('expandEvent', [ $_event, $_scope ]);
			};
			/**
			 * Alias for addFunctionEventListener
			 */
			this.on = this.addFunctionEventListener;
			/**
			 * Méthode permettant de déclarer une fonction globale liée à une méthode de l'objet en cours
			 * @param $_functionName string nom de la fonction globale
			 * @param $_methodName string nom de la méthode de l'objet en cours
			 * @return booltrue|false
			 */
			this.globalFunction = function globalFunction($_functionName, $_methodName)
			{
				try
				{
					if (this.getName() != '')
					{
						var functionPrototype = 'window.' + $_functionName + ' = function ' + $_functionName + '($_scope,$_event) { return ' + this.getName() + '.' + $_methodName + '($_scope,$_event); }';
						var fonction = eval(functionPrototype);
						/**
						 * Si la méthode n'existe pas au sein de l'objet en cours, on la crée dynamiquement
						 */
						//if (!isset(this[$_methodName]))
							N.registerProperty(this, $_methodName, this.onDomEvent);
						return this.displayLog('globalFunction', 'Définition de la fonction globale "' + $_functionName + '" pour la méthode "' + this.getName() + '.' + $_methodName + '"');
					}
					else
						return this.displayLog('globalFunction', 'Attribute name de l\'objet indéfini', true);
				}
				catch (e)
				{
					return !this.displayLog('globalFunction', 'Erreur lors de la définition de la fonction globale "' + $_functionName + '" pour la méthode "' + this.getName() + '.' + $_methodName + '" : ' + e, true);
				}
			};
			/**
			 * Méthode générique de prise en charge des appels sur les événements de type DOM
			 * @param $_scope HTMLElement
			 * @param $_event HTMLDomEvent
			 * @return bool true
			 */
			this.onDomEvent = function onDomEvent($_scope, $_event)
			{
				return this.displayLog('onDomEvent', 'Evénement de type "' + $_event.type + '" sur l\'élément d\'id "' + $_scope.id + '"');
			};
			/**
			 * Surcharge de la méthode afin de lancer la déclaration des méthodes de type on sur les événements DOM génériques
			 * @param $_name string nom globa de l'objet
			 * @return bool true
			 */
			this.setName = function setName($_name)
			{
				if (this.toString() == this.EVENTMANAGER)
					this.superclass.setName.apply(this, arguments);
				else
					this.getSuper().setName.apply(this, arguments);
				/**
				 * Fonctions gobales
				 */
				this.globalFunction('onClickF', 'on' + this.ON_CLICK);
				this.globalFunction('onSubmitF', 'on' + this.ON_SUBMIT);
				this.globalFunction('onMouseoverF', 'on' + this.ON_MOUSE_OVER);
				this.globalFunction('onMouseoutF', 'on' + this.ON_MOUSE_OUT);
				this.globalFunction('onKeyupF', 'on' + this.ON_KEY_UP);
				this.globalFunction('onKeydownF', 'on' + this.ON_KEY_DOWN);
				this.globalFunction('onChangeF', 'on' + this.ON_CHANGE);
				this.globalFunction('onFocusF', 'on' + this.ON_FOCUS);
				this.globalFunction('onBlurF', 'on' + this.ON_BLUR);
				return this.displayLog('setName', $_name);
			};
			/**
			 * Constructeur de la classe
			 *
			 * @param $_displayDebug bool indique qu'il faut activer ou non l'affichage des debug
			 * @return EventManager
			 */
			this._construct = function _construct(/*bool $_displayDebug*/)
			{
				N.registerProperty(this, 'EVENTMANAGER', 'EventManager');
				N.registerProperty(this, 'ON_CLICK', 'click');
				N.registerProperty(this, 'ON_SUBMIT', 'submit');
				N.registerProperty(this, 'ON_MOUSE_OVER', 'mouseover');
				N.registerProperty(this, 'ON_MOUSE_OUT', 'mouseout');
				N.registerProperty(this, 'ON_KEY_UP', 'keyup');
				N.registerProperty(this, 'ON_KEY_DOWN', 'keydown');
				N.registerProperty(this, 'ON_CHANGE', 'change');
				N.registerProperty(this, 'ON_FOCUS', 'focus');
				N.registerProperty(this, 'ON_BLUR', 'blur');
				if (this.toString() == this.EVENTMANAGER)
					this.superclass._construct.apply(this, arguments);
				else
					this.getSuper()._construct.apply(this, arguments);
				this.initVars();
				this.displayLog('_construct', 'Init de ' + this.EVENTMANAGER);
				return this;
			};
			this._construct(arguments[0]);
		};
		/**
		 * Héritage de la classe
		 */
		N.extend(EventManager, N.NiouseoGen);
		N.registerProperty(N, 'EventManager', EventManager);
	})();
}
