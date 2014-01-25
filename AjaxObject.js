/**
 * @package Niouseo
 * @subpackage NiouseoAjaxObject
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
		 * Classe générique de définition de l'objet de requete uniquement AJAX vers un WebService
		 */
		var AjaxObject = function AjaxObject()
		{
			this.classInfo = { 'appName' : 'AjaxObject', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '25/10/08' };
			this.initVars = function initVars()
			{
				if (this.toString() == this.AJAXOBJECT)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				/**
				 * Création des attributs de la classe et de leur méthode respectives
				 */
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendArrayOfAttributes(new Array( { 'name' : 'httpUrl', 'default' : '' },//url du service à appeler
				{ 'name' : 'httpParams', 'default' : '' },//paramétres à passer en requete GET
				{ 'name' : 'response', 'default' : '' },//réponse de la requete Ajax
				{ 'name' : 'id', 'default' : '' }//identifiant de l'objet de requete ajax
				));
			};
			/**
			 * Nom de la classe de l'objet
			 * Attribut non modifiable
			 */
			this.toString = function toString()
			{
				return this.AJAXOBJECT;
			};
			/**
			 * Méthode d'exécution de la requete
			 *
			 * @return bool true
			 */
			this.startRequest = function startRequest()
			{
				var url = new String(this.getHttpUrl()).substring(0, new String(this.getHttpUrl()).lastIndexOf('.php?') + 4);
				var params = new String(this.getHttpUrl()).substring(new String(this.getHttpUrl()).lastIndexOf('.php?') + 5);
				this.displayLog('startRequest', new Array(url, params));
				YAHOO.util.Connect.asyncRequest(this.getHttpMethod(), this.getHttpMethod() == this.GET_METHOD ? this.getHttpUrl() : url, { 'success' : this.handleResponse, 'failure' : this.handleResponse, 'scope' : this/*eval(this.getId())*/, 'argument' : this.getId() }, this.getHttpMethod() == this.GET_METHOD ? null : params);
				return this.displayLog('startRequest', 'Fin de la méthode');
			};
			/**
			 * Méthode chargée de récupérer la réponse de la requete AJAX et de dispatcher la réponse selon la vérification de la réponse
			 *
			 * @param string la réponse du webservice
			 * @return bool true or false
			 */
			this.handleResponse = function handleResponse(/*string*/$_response)
			{
				if (isset($_response))
				{
					this.setResponse($_response.responseText);
					return this.displayLog('handleResponse', $_response, !this.processSuccess());
				}
				else
					return !this.displayLog('handleResponse', $_response, !this.handleFailure());
			};
			/**
			 * Méthode de gestion d'une réponse négative
			 *
			 * @return bool false
			 */
			this.handleFailure = function handleFailure()
			{
				return !this.displayLog('handleFailure', { 'Erreur dans la réponse du webservice' : this.getResponse() }, true);
			};
			/**
			 * Méthode de gestion d'une réponse positive
			 *
			 * @return bool true
			 */
			this.processSuccess = function processSuccess()
			{
				try
				{
					return this.displayLog('processSuccess', 'Fin d\'appel de la méthode', !eval(this.getResponse()));
				}
				catch (e)
				{
					return !this.displayLog('processSuccess', 'Erreur d\'appel de la méthode en charge de la réponse "' + e + '"', false);
				}
			};
			/**
			 * Méthode d'instanciation de l'objet
			 *
			 * @param bool optional true|false pour activer le debug
			 * @return Caller object
			 */
			this._construct = function _construct(/*bool $_DisplayDebug*/)
			{
				N.registerProperty(this, 'AJAXOBJECT', 'AjaxObject');
				if (this.toString() == this.AJAXOBJECT)
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
		N.extend(AjaxObject, N.Caller);
		N.registerProperty(N, 'AjaxObject', AjaxObject);
	})();
}
