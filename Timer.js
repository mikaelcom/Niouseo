/**
 * @package Niouseo
 * @subpackage NiouseoTimer
 * @author Mikaël DELSOL
 * @copyright Mikaël DELSOL
 * @version 1.0 
 */
if (typeof isset != 'undefined' && isset(NIOUSEO))
{
	( function()
	{
		/**
		 * Raccourci vers la définition du prototype de la classe
		 */
		var N = NIOUSEO.prototype;
		/**
		 * Classe de représentation d'un timer permettant d'exécuter des
		 * fonctions aux moments indiqués, à la fréquence demandée, etc
		 */
		var Timer = function Timer()
		{
			this.classInfo = { 'appName' : 'Timer', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '21/06/2010' };
			this.toString = function toString()
			{
				return this.TIMER;
			};
			this.initVars = function initVars()
			{
				if (this.toString() == this.TIMER)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				this.setName(this.toString());
				/**
				 * Création des attributs de la classe et de leur méthode respectives
				 */
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendArrayOfAttributes(new Array( { 'name' : 'calls', 'default' : new Array() }, { 'name' : 'starts', 'default' : new Array() }, { 'name' : 'everys', 'default' : new Array() }));
				return this.displayLog('initVars', 'Appel de la méthode');
			};
			/**
			 * Méthode permettant de définir le lancement d'une fonction pour une fréquence donnée
			 * @param $_objectToCall Object|string objet à appeler
			 * @param $_functionToCall string la fonction à appeler
			 * @param $_everySeconds float le nombre de seconde entre chaque appel
			 * @param $_untilSeconds float le nombre de seconde à ne pas dépasser
			 * @return bool true|false
			 */
			this.callEvery = function callEvery($_objectToCall, $_functionToCall, $_everySeconds, $_untilSeconds)
			{
				if (isNaN($_everySeconds) || isNaN($_untilSeconds))
					return !this.displayLog('callEvery', arguments, true);
				var me = (isObject(this.getParent()) ? this.getParent().getName() + '.getOTi()' : this.getName());
				try
				{
					if (isObject(eval(me)))
					{
						if (isFunction(eval(this.getObjectName($_objectToCall) + '.' + $_functionToCall)))
						{
							/**
							 * Compteur du nombre d'appel des méthodes par classe
							 */
							if (!this.getElementOfCallsAt(this.getObjectName($_objectToCall)))
							{
								this.addToCalls(this.getObjectName($_objectToCall), new Array());
								this.getElementOfCallsAt(this.getObjectName($_objectToCall))[$_functionToCall] = 0;
							}
							else
							{
								if (!keyInArray($_functionToCall, this.getElementOfCallsAt(this.getObjectName($_objectToCall))))
									this.getElementOfCallsAt(this.getObjectName($_objectToCall))[$_functionToCall] = 0;
							}
							/**
							 * Date de début de l'appel
							 */
							if (!this.getElementOfStartsAt(this.getObjectName($_objectToCall)))
							{
								this.addToStarts(this.getObjectName($_objectToCall), new Array());
								this.getElementOfStartsAt(this.getObjectName($_objectToCall))[$_functionToCall] = new N.Time(this.getDisplayDebug());
							}
							else
							{
								if (!keyInArray($_functionToCall, this.getElementOfStartsAt(this.getObjectName($_objectToCall))))
									this.getElementOfStartsAt(this.getObjectName($_objectToCall))[$_functionToCall] = new N.Time(this.getDisplayDebug());
							}
							/**
							 * Valeur origniale de délai
							 */
							if (!this.getElementOfEverysAt(this.getObjectName($_objectToCall)))
							{
								this.addToEverys(this.getObjectName($_objectToCall), new Array());
								this.getElementOfEverysAt(this.getObjectName($_objectToCall))[$_functionToCall] = $_everySeconds;
							}
							else
							{
								if (!keyInArray($_functionToCall, this.getElementOfEverysAt(this.getObjectName($_objectToCall))))
									this.getElementOfEverysAt(this.getObjectName($_objectToCall))[$_functionToCall] = $_everySeconds;
							}
							/**
							 * Enregistrement de l'appel de la fonction de timer
							 */
							var timeOutId = setTimeout('eval(' + me + '.timeOut(' + this.getObjectName($_objectToCall) + ',\'' + $_functionToCall + '\',' + $_everySeconds + ',' + $_untilSeconds + '))', $_everySeconds * 1000);
							return this.displayLog('callEvery', [ timeOutId, arguments ]);
						}
						else
							return !this.displayLog('callEvery', arguments, true);
					}
					else
						return !this.displayLog('callEvery', [ me, arguments ], true);
				}
				catch (e)
				{
					return !this.displayLog('callEvery', [ e, arguments ], true);
				}
			};
			/**
			 * Méthode permettant d'indiquer d'appeler la fonction dans un laps de temps en seconde
			 * @param $_objectToCall Object|string objet à appeler
			 * @param $_functionToCall string fonction à appeler
			 * @param $_inSeconds float le nombre de seconde avant d'appeler la fonction
			 * @return bool true|false
			 */
			this.callIn = function callIn($_objectToCall, $_functionToCall, $_inSeconds)
			{
				return this.displayLog('callIn', arguments, !this.callEvery($_objectToCall, $_functionToCall, $_inSeconds, $_inSeconds + 0.5));
			};
			/**
			 * Méthode permettant à un objet de se retirer des appels réguliers
			 * @param $_objectToCall Object|string
			 * @param $_functionToCall string nom de la méthode à ne plus appeler/null=>toutes les méthodes
			 * @return bool true|false
			 */
			this.stopCalls = function stopCalls($_objectToCall, $_functionToCall)
			{
				if (this.getElementOfStartsAt(this.getObjectName($_objectToCall)))
				{
					/**
					 * Suppression globale
					 */
					if (!isset($_functionToCall))
					{
						var del = delete this.deleteElementOfStartsByIndex(this.getObjectName($_objectToCall));
						del &= delete this.deleteElementOfCallsByIndex(this.getObjectName($_objectToCall));
						del &= delete this.deleteElementOfEverysByIndex(this.getObjectName($_objectToCall));
						return this.displayLog('stopCalls', 'Suppression de tous les appels pour la classe "' + this.getObjectName($_objectToCall) + '"', !del);
					}
					/**
					 * Suppression pour une fonction en particulier
					 */
					else
					{
						var del = delete this.getElementOfStartsAt(this.getObjectName($_objectToCall))[$_functionToCall];
						del &= delete this.getElementOfCallsAt(this.getObjectName($_objectToCall))[$_functionToCall];
						del &= delete this.getElementOfEverysAt(this.getObjectName($_objectToCall))[$_functionToCall];
						return this.displayLog('stopCalls', 'Suppression des appels pour la fonction "' + $_functionToCall + '"', !del);
					}
				}
				else
					return !this.displayLog('stopCalls', arguments, true);
			};
			/**
			 * Méthode propre à la classe étant appelée pour tous les timers et gérant les appels
			 * @param $_objectToCall Object|string
			 * @param $_functionToCall string
			 * @param $_everySeconds float
			 * @param $_untilSeconds float
			 * @return bool true|false
			 */
			this.timeOut = function timeOut($_objectToCall, $_functionToCall, $_everySeconds, $_untilSeconds)
			{
				if (isNaN($_everySeconds) || isNaN($_untilSeconds))
					return !this.displayLog('timeOut', arguments, true);
				/**
				 * Si délai de temps non dépassé
				 */
				if (!this.timeIsElapsed($_objectToCall, $_functionToCall, $_untilSeconds))
				{
					try
					{
						/**
						 * Appel de la méthode
						 */
						eval(this.getObjectName($_objectToCall) + '.' + $_functionToCall + '()');
						/**
						 * Incrémentation du compteur de temps pendants lequel la fonction a été appelée
						 * Si la fonction ne s'est pas désinscrite
						 */
						if (this.getElementOfCallsAt(this.getObjectName($_objectToCall)) && keyInArray($_functionToCall, this.getElementOfCallsAt(this.getObjectName($_objectToCall))))
						{
							/**
							 * On incrémente le nombre d'appel de la fonction 
							 */
							this.getElementOfCallsAt(this.getObjectName($_objectToCall))[$_functionToCall] += 1;
							/**
							 * Si temps dépassé, on supprime les appels
							 */
							if (this.timeIsElapsed($_objectToCall, $_functionToCall, $_untilSeconds))
								return this.displayLog('timeOut', 'Suppression des appels de la fonction "' + $_functionToCall + '"', !this.stopCalls($_objectToCall, $_functionToCall));
							/**
							 * Si temps restant
							 * On s'inscrit de nouveau dans le timer en prenant en compte le retard accumulé d'exécution des instructions
							 */
							else
								return this.displayLog('timeOut', 'Appels relancés', !this.callEvery($_objectToCall, $_functionToCall, this.getNewDelay($_objectToCall, $_functionToCall), $_untilSeconds));
						}
						else
							return this.displayLog('timeOut', 'Fin des appels');
					}
					catch (e)
					{
						return !this.displayLog('timeOut', [ e, arguments ], true);
					}
				}
				/**
				 * Temps dépassé, on la supprime
				 */
				else
					return this.displayLog('timeOut', 'Suppression des appels de la fonction "' + $_functionToCall + '"', !this.stopCalls($_objectToCall, $_functionToCall));
			};
			/**
			 * Méthode de vérification du temps pendant lequel la focntion doit étre appelée afin de ne pas dépasser ce temps
			 * @param $_objectToCall Object|string
			 * @param $_functionToCall string nom de la fonction
			 * @param $_untilSeconds float le nombre de seconde
			 * @return bool true|false
			 */
			this.timeIsElapsed = function timeIsElapsed($_objectToCall, $_functionToCall, $_untilSeconds)
			{
				if (!isNaN($_untilSeconds) && this.getElementOfStartsAt(this.getObjectName($_objectToCall)) && keyInArray($_functionToCall, this.getElementOfStartsAt(this.getObjectName($_objectToCall))))
					return this.getElementOfStartsAt(this.getObjectName($_objectToCall))[$_functionToCall].getMilliSecondsElapsed() > ($_untilSeconds * 1000);
				else
					return true;
			};
			/**
			 * Méthode permettant de récupérer le nouveau délai d'appel en considération du temps d'exécution des instructions
			 * @param $_objectToCall Object|string
			 * @param $_functionToCall string nom de la fonction
			 * @return float
			 */
			this.getNewDelay = function getNewDelay($_objectToCall, $_functionToCall)
			{
				if (this.getElementOfEverysAt(this.getObjectName($_objectToCall)) && keyInArray($_functionToCall, this.getElementOfEverysAt(this.getObjectName($_objectToCall))) && this.getElementOfStartsAt(this.getObjectName($_objectToCall)) && keyInArray($_functionToCall, this.getElementOfStartsAt(this.getObjectName($_objectToCall))))
				{
					/**
					 * Délai d'origine
					 */
					var everySeconds = this.getElementOfEverysAt(this.getObjectName($_objectToCall))[$_functionToCall];
					/**
					 * Temps réel écoulé
					 */
					var milliSecondsElapsed = this.getElementOfStartsAt(this.getObjectName($_objectToCall))[$_functionToCall].getMilliSecondsElapsed();
					/**
					 * Calcul du différentiel et retour du nouveau délai en secondes
					 */
					return (((everySeconds * 1000) - (milliSecondsElapsed % (everySeconds * 1000))) / 1000);
				}
				else
					return NaN;
			};
			/**
			 * Méthode permettant de récupérer le nombre de fois que la fonction a été appelée
			 * @param $_objectToCall Object|string la classe
			 * @param $_functionToCall string le méthode
			 * @return int|null
			 */
			this.getCalledTimes = function getCalledTimes($_objectToCall, $_functionToCall)
			{
				return (this.getElementOfCallsAt(this.getObjectName($_objectToCall)) && keyInArray($_functionToCall, this.getElementOfCallsAt(this.getObjectName($_objectToCall)))) ? this.getElementOfCallsAt(this.getObjectName($_objectToCall))[$_functionToCall] : null;
			};
			/**
			 * Méthode interne permettant de récupérer le nom de l'objet à appeler
			 * @param $_objectToCall string|Object
			 * @return string
			 */
			this.getObjectName = function getObjectName($_objectToCall)
			{
				return isObject($_objectToCall) ? $_objectToCall.getName() : $_objectToCall;
			};
			/**
			 * Constructeur de la classe
			 * @return Timer
			 */
			this._construct = function _construct()
			{
				N.registerProperty(this, 'TIMER', 'Timer');
				if (this.toString() == this.TIMER)
					this.superclass._construct.apply(this, arguments);
				else
					this.getSuper()._construct.apply(this, arguments);
				this.initVars();
				this.displayLog('_construct', 'Init de ' + this.toString());
				return this;
			};
			this._construct(arguments[0]);
		};
		/**
		 * Héritage de la classe
		 */
		N.extend(Timer, N.NiouseoGen);
		N.registerProperty(N, 'Timer', Timer);
	})();
}
