/**
 * @package Niouseo
 * @subpackage NiouseoTime
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
		 * Classe de représentation d'un temps de création et permettant de récuperer
		 * des temps d'existence en différentes unités
		 */
		var Time = function Time()
		{
			this.classInfo = { 'appName' : 'Time', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '25/06/2010' };
			this.toString = function toString()
			{
				return this.TIME;
			};
			this.initVars = function initVars()
			{
				if (this.toString() == this.TIME)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				this.setName(this.toString());
				/**
				 * Création des attributs de la classe et de leur méthode respectives
				 */
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendArrayOfAttributes(new Array( { 'name' : 'date', 'default' : new Date() }));
				return this.displayLog('initVars', 'Appel de la méthode');
			};
			/**
			 * Méthode permettant de récupérer le temps depuis la création de l'objet
			 * @return int|null
			 */
			this.getTimeElapsed = function getTimeElapsed()
			{
				return (new Date().getTime() - this.getDate().getTime());
			};
			/**
			 * Méthode permettant de récupérer le nombre de jours depuis la création de l'objet
			 * @return int|null
			 */
			this.getDaysElapsed = function getDaysElapsed()
			{
				return parseInt(this.getTimeElapsed() / (24 * 60 * 60 * 1000));
			};
			/**
			 * Méthode permettant de récupérer le nombre d'heures depuis la création de l'objet
			 * @return int|null
			 */
			this.getHoursElapsed = function getHoursElapsed()
			{
				return parseInt(this.getTimeElapsed() / (60 * 60 * 1000));
			};
			/**
			 * Méthode permettant de récupérer le nombre de minutes depuis la création de l'objet
			 * @return int|null
			 */
			this.getMinutesElapsed = function getMinutesElapsed()
			{
				return parseInt(this.getTimeElapsed() / (60 * 1000));
			};
			/**
			 * Méthode permettant de récupérer le nombre de secondes depuis la création de l'objet
			 * @return int|null
			 */
			this.getSecondsElapsed = function getSecondsElapsed()
			{
				return parseInt(this.getTimeElapsed() / 1000);
			};
			/**
			 * Méthode permettant de récupérer le nombre de millisecondes depuis la création de l'objet
			 * @return int|null
			 */
			this.getMilliSecondsElapsed = function getMilliSecondsElapsed()
			{
				return parseInt(this.getTimeElapsed());
			};
			/**
			 * Constructeur de la classe
			 * @return Time
			 */
			this._construct = function _construct()
			{
				N.registerProperty(this, 'TIME', 'Time');
				if (this.toString() == this.TIME)
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
		N.extend(Time, N.NiouseoGen);
		N.registerProperty(N, 'Time', Time);
	})();
}
