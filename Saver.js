/**
 * @package Niouseo
 * @subpackage NiouseoSaver
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
		 * Classe permettant de facilement enregistrer des données par une requete ajax/rest
		 * Il est nécessaire de définir l'url (httpUrl) du service qui doit recevoir les données et les paramétres à envoyer (values)
		 */
		var Saver = function Saver()
		{
			this.classInfo = { 'appName' : 'Saver', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '30/10/08' };
			this.initVars = function initVars()
			{
				if (this.toString() == this.SAVER)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				/**
				 * Création des attributs de la classe et de leur méthode respectives
				 */
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendArrayOfAttributes(new Array( { 'name' : 'values', 'default' : [] }));
				return this.displayLog('initVars', 'Appel de la méthode');
			};
			/**
			 * Méthode retournant le nom de la classe
			 * @return string
			 */
			this.toString = function toString()
			{
				return this.SAVER;
			};
			/**
			 * Méthode de lancement de la requete d'enregistrement des informations souhaitées
			 * Il est possible de directement passer les paramétres à enregistrer à l'appel de la fonction. 
			 * Pour cela, il faut passer un tableau d'objet des valeurs qui seront alors utilisées pour l'enregistrement
			 *
			 * @param array optional
			 * @return bool true
			 */
			this.doSave = function doSave(/*array|object $_values*/)
			{
				if (isset(arguments[0]))
					this.setValues(arguments[0]);
				if (isArray(this.getValues()) || isObject(this.getValues()))
				{
					this.displayLog('save', 'Utlisation des paramétres');
					/**
					 * Attribution des paramétres à envoyer
					 */
					this.parseValues();
					/**
					 * Envoie de la requete
					 */
					return this.displayLog('save', 'Lancement de l\'enregistrement', !this.sendRequest());
				}
				else
					return !this.displayLog('save', 'Les paramétres à enregistrer ne correspondent pas aux types pris en charge : "' + (typeof this.getvalues()) + '"', true);
			};
			/**
			 * Alias plus explicite pour la méthode doSave permettant simplement d'exécuter l'appel de la requete 
			 */
			this.doRequest = this.doSave;
			/**
			 * Méthode utilisée par la classe afin de parcourir les données à enregistrer 
			 * et de définir les attributs à elle-méme afin qu'ils soient utilisés par la méthode de génération de la requete
			 *
			 * @return bool true
			 */
			this.parseValues = function parseValues()
			{
				for ( var paramName in this.getValues())
				{
					this.getAttributeFactory().setObject(this);
					this.getAttributeFactory().appendAttribute(paramName, this.getValues()[paramName], true);
					this.addToParamsToSend( { 'name' : paramName, 'type' : 'STRING', 'getMethod' : 'this.' + this.getAttributeFactory().getGetMethodName(paramName) });
				}
				return this.displayLog('parseValues', 'Fin');
			};
			/**
			 * Constructeur de la classe
			 * @return Saver
			 */
			this._construct = function _construct()
			{
				N.registerProperty(this, 'SAVER', 'Saver');
				if (this.toString() == this.SAVER)
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
		N.extend(Saver, N.Caller);
		N.registerProperty(N, 'Saver', Saver);
	})();
}
