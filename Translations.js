/**
 * @package Niouseo
 * @subpackage NiouseoTranslations
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
		 * Classe de gestion des traductions :
		 * 	- chargement des traduction de la classe mére
		 * 	- manipulation des traduction
		 */
		var Translations = function Translations()
		{
			this.classInfo = { 'appName' : 'Translations', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '09/03/2009' };
			this.initVars = function initVars()
			{
				if (this.toString() == this.TRANSLATIONS)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				this.setName(this.toString());
				/**
				 * Création des attributs de la classe et de leur méthode respectives
				 */
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendArrayOfAttributes(new Array( { 'name' : 'translations', 'default' : new Array() }));
				/**
				 * Méthode alias
				 */
				this.get = this.getElementOfTranslationsAt;
				return this.displayLog('initVars', 'Appel de la méthode');
			};
			/**
			 * Nom de la classe de l'objet
			 * Attribut non modifiable
			 */
			this.toString = function toString()
			{
				return this.TRANSLATIONS;
			};
			/**
			 * Méthode d'appel pour la récupération des traductions de la classe parente
			 * @return bool true|false
			 */
			this.loadTranslations = function loadTranslations()
			{
				if (isset(this.getParent()) && isset(this.getParent().CONTEXT_TO_CALL))
				{
					this.setNiouseoContextToCall(this.getParent().CONTEXT_TO_CALL);
					this.setNiouseoModeToCall('gettranslations');
					this.defineCallback('loadTranslationsCallback');
					return this.displayLog('loadTranslations', 'Chargement des traductions', !this.doRequest());
				}
				else
					return !this.displayLog('loadTranslations', 'L\'objet parent n\'est pas défini', true);
			};
			/**
			 * Méthode de réception des traductions chargées
			 * @param $_r Object l'objet da la réponse
			 * @return bool true|false
			 */
			this.loadTranslationsCallback = function loadTranslationsCallback($_r)
			{
				if (!this.rIsError($_r) && isset(this.rContent($_r)) && (isArray(this.rContent($_r)) || isObject(this.rContent($_r))))
				{
					var translations = this.rContent($_r);
					for ( var key in translations)
						addValueToArray(this.getTranslations(), translations[key], key);
					return this.displayLog('loadTranslationsCallback', $_r, !this.fireEvent(this.ON_TRANSLATIONS_LOADED, this, translations));
				}
				else
					return !this.displayLog('loadTranslationsCallback', $_r, true);
			};
			/**
			 * Constructeur de la classe
			 * @return Translations
			 */
			this._construct = function _construct()
			{
				N.registerProperty(this, 'TRANSLATIONS', 'Translations');
				this.addToEvents('ON_TRANSLATIONS_LOADED', 'onTranslationsLoaded');
				if (this.toString() == this.TRANSLATIONS)
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
		N.extend(Translations, N.Saver);
		N.registerProperty(N, 'Translations', Translations);
	})();
}
