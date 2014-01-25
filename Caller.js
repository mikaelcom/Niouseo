/**
 * @package Niouseo
 * @subpackage NiouseoCaller
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
		 * Classe générique de définition de la méthode requete et de construction d'une requete AJAX/HTTP/REST
		 * vers un WebService
		 */
		var Caller = function Caller()
		{
			this.classInfo = { 'appName' : 'Caller', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '31/08/08' };
			this.initVars = function initVars()
			{
				if (this.toString() == this.CALLER)
					this.superclass.initVars.apply(this);
				else
					this.getSuper().initVars.apply(this);
				/**
				 * Création des attributs de la classe et de leur méthode respectives
				 */
				this.getAttributeFactory().setObject(this);
				this.getAttributeFactory().appendArrayOfAttributes(new Array( { 'name' : N.CONTEXT_KEY, 'default' : '' },//Nom attribut à l'action utilisée
				{ 'name' : N.MODE_KEY, 'default' : '' },//Nom attributé à l'action appelée
				{ 'name' : 'name', 'default' : '' },//Nom attributé à l'objet
				{ 'name' : 'context', 'default' : '' },//Attribut à passer au webservice qu'il est censé nous retourner (==contexte)
				{ 'name' : 'callback', 'default' : '' },//Nom de la fonction devant étre rappelé lors dela réponse du webservice
				{ 'name' : 'outputs', 'default' : [ 'json', 'xml' ] },//Formats de réponses disponibles du WebService
				{ 'name' : 'output', 'default' : 'json' },//Format de la réponse que doit nous renvoyez le WebService en question
				{ 'name' : 'url', 'default' : '' },//Url du webservice
				{ 'name' : 'httpRequest', 'default' : '' },//La requete http allant étre appelée (url du webservice auquel est ajoutée les paramétres d'appel
				{ 'name' : 'httpMethod', 'default' : this.POST_METHOD },//Méthode d'envoi des données lors d'appel AJAX
				{ 'name' : 'paramsToSend', 'default' : [] },//Tableau des paramétres à envoyer lors de la requtes. Cela permet une construction générique des paramétres envoyés
				{ 'name' : 'index', 'default' : 0 },//Index de positionement de type entier ou chaine de caractéres selon le besoin. Par défaut, il vaut 0
				{ 'name' : 'callType', 'default' : this.AJAX },//mode de requetage (ajax=>utilisation de Yahoo ou rest => création de lien vers des fichiers javascript contennt alors la réponse du webservice)
				{ 'name' : 'mode', 'default' : '' },//Mode d'utilisation en cours 
				{ 'name' : 'modes', 'default' : [] }//Tableau des modes d'utilisation possibles de l'objet
				// - positioning : calcul du positionnement du site dans l'intervalle de recherche [0,this.nresults]
				// - present : test de l'existence du site dans les résultats de recherche pour le mots clefs et l'intervalle de recherche [0,this.nresults]
				, { 'name' : 'loading', 'default' : false }, { 'name' : 'hostname', 'default' : false }));
				this.setLoading(null);
				return this.displayLog('initVars', 'Fin de la méthode');
			};
			/**
			 * Nom de la classe de l'objet
			 * Attribut non modifiable
			 */
			this.toString = function toString()
			{
				return this.CALLER;
			};
			/**
			 * Méthode permettant de définir la valeur du contexte à envoyer au WebService Niouseo afin qu'il reconnaisse le module appelé
			 * 
			 * @param string le module à appeler
			 * @return bool true
			 */
			this.setNiouseoContextToCall = function setNiouseoContextToCall(/*string*/$_contextToCall)
			{
				this[N.CONTEXT_KEY] = $_contextToCall;
				return this.displayLog('setNiouseoContextToCall', { 'contextToCallKey' : N.CONTEXT_KEY, 'value' : $_contextToCall });
			};
			/**
			 * Méthode permettant de récupérer la valeur du contexte à envoyer au WebService Niouseo afin qu'il reconnaisse le module appelé
			 * 
			 * @return string le module à appeler
			 */
			this.getNiouseoContextToCall = function getNiouseoContextToCall()
			{
				return this[N.CONTEXT_KEY];
			};
			/**
			 * Méthode permettant de définir l'action appelée
			 * 
			 * @param string le nom de l'action
			 * @return bool true
			 */
			this.setNiouseoModeToCall = function setNiouseoModeToCall(/*string*/$_modeToCall)
			{
				this[N.MODE_KEY] = $_modeToCall;
				return this.displayLog('setNiouseoModeToCall', $_modeToCall);
			};
			/**
			 * Méthode permettant de récupérer l'action appelée
			 * 
			 * @return string le nom de l'action
			 */
			this.getNiouseoModeToCall = function getNiouseoModeToCall()
			{
				return this[N.MODE_KEY];
			};
			/**
			 * Méthode de définition du mode
			 * 
			 * @param string le mode d'utilisation
			 * @return bool true| false si le mode n'est pas pris en charge
			 */
			this.setMode = function setMode($_mode)
			{
				if ((this.getMode() == "" && $_mode != "") || this.getMode() != $_mode)
				{
					if (inArray($_mode, this.getModes()))
					{
						this.mode = $_mode;
						return this.displayLog('setMode', $_mode);
					}
					else
						return !this.displayLog('setMode', $_mode, true);
				}
				else
					return true;
			};
			/**
			 * Méthode chargée d'incrémenté l'index
			 * 
			 * @return int la nouvelle valeur de l'index
			 */
			this.incrIndex = function incrIndex()
			{
				this.setIndex(this.getIndex() + 1);
				this.displayLog('incrIndex', 'index vaut maintenant : ' + this.index);
				return this.getIndex();
			};
			/**
			 * Méthode chargée de décrémenter l'index
			 * 
			 * @return int la nouvelle valeur de l'index
			 */
			this.decrIndex = function decrIndex()
			{
				if (this.getIndex() > 0)
					this.setIndex(this.getIndex() - 1);
				else
					this.setIndex(0);
				this.displayLog('decrIndex', 'index vaut maintenant : ' + this.index);
				return this.getIndex();
			};
			/**
			 * Méthode de définition du format de réponse
			 * (xml, json, php)
			 * @param string this.format de réponse souhaité
			 * @return bool true
			 */
			this.setOutput = function setOutput($_output)
			{
				if (inArray($_output, this.getOutputs()) && ((this.getOutput() == '' && $_output != '') || this.getOutput() != $_output))
				{
					this.output = $_output;
					return this.displayLog('setOutput', $_output);
				}
				else
				{
					if (!inArray($_output, this.getOutputs()))
						return !this.displayLog('setOutput', $_output, true);
					else
						return this.displayLog('setOutput', $_output);
				}
			};
			/**
			 * Méthode permettant de récupérer les résultats de la recherche
			 * On construit la requete http au dernier moment afin d'étre sér de la contenance de la requete 
			 *
			 * @return string|null
			 */
			this.getHttpRequest = function getHttpRequest()
			{
				var httprequest = "";
				/**
				 * Vérification du nom de l'objet si la méthode de gestion de la réponse est définie 
				 */
				if (this.getName() === '' && this.getCallback() === '')
				{
					this.displayLog('getHttpRequest', 'Le nom de l\'objet n\'est pas défini, de ce fait, la requete ne peut étre lancée', true);
					return null;
				}
				/**
				 * Vérification de callback si le nom est défini (testé auparavant)
				 */
				if (this.getCallback() === '')
					this.defineCallback('receiveResponse');
				for ( var paramToSend in this.getParamsToSend())
				{
					switch (this.getParamsToSend()[paramToSend]['type'])
					{
						case 'STRING':
							httprequest += !(eval(this.getParamsToSend()[paramToSend]['getMethod'] + '(true)') === '') ? (httprequest != '' ? '&' : '') + this.getParamsToSend()[paramToSend]['name'] + '=' + encodeURIComponent(new String(eval(this.getParamsToSend()[paramToSend]['getMethod'] + '(true)'))/*.replace(/(\s)+/g, "+")*/) : '';
							break;
						case 'NUMBER':
							httprequest += !(eval(this.getParamsToSend()[paramToSend]['getMethod'] + '(true)') === '') ? (httprequest != '' ? '&' : '') + this.getParamsToSend()[paramToSend]['name'] + '=' + encodeURIComponent(new String(eval(this.getParamsToSend()[paramToSend]['getMethod'] + '(true)'))/*.replace(/(\s)+/g, "+")*/) : '';
							break;
					}
				}
				httprequest = this.getUrl() + httprequest;
				if (!isset(this.setHttpRequest(httprequest)))
					return !this.displayLog('getHttpRequest', 'Erreur de définition de la requete http de recherche');
				this.displayLog('getHttpRequest', this.httpRequest);
				return this.httpRequest;
			};
			/**
			 * Méthode permettant d'ajouter aux paramétres déjé envoyé un autre paramétres
			 * Si le paramétre existe déjé, alors il n'est ajouté
			 *
			 * @param object {'type':[NUMBER|STRING],'name':paramName,'getMethod':method_to_execute_to_get_the_param_value}
			 * @return bool true si OK
			 */
			this.addToParamsToSend = function addToParamsToSend(/*object*/$_paramToSend)
			{
				if (isset($_paramToSend['type']) && isset($_paramToSend['name']) && isset($_paramToSend['getMethod']))
				{
					var exists = false;
					for ( var paramToSend in this.getParamsToSend())
						exists |= this.getParamsToSend()[paramToSend]['name'] == $_paramToSend['name'];
					if (isFalse(exists))
						this.getParamsToSend().push($_paramToSend);
					return this.displayLog('addToParamsToSend', $_paramToSend);
				}
				else
					return !this.displayLog('addToParamsToSend', 'L\'objet à ajouter ne contient pas toutes les propriété requises (type+name+getMethod)', true);
			};
			/**
			 * Méthode permettant d'ajouter des paramétres devant étre transmis dans la requete à l'aide d'un tableau d'objet paramétres
			 *
			 * @param array un tableau contenant des objets définissant les pramétres à ajouter à l'envoi de la requete
			 * @return bool true si tout est ok|false si au moins un des paramétresd n'est pas bon
			 */
			this.addArrayOfParamsToSend = function addArrayOfParamsToSend(/*array*/$_arrayOfParamsToSend)
			{
				var addArrayOfParamsToSendResult = true;
				if (isset($_arrayOfParamsToSend) && isArray($_arrayOfParamsToSend) && count($_arrayOfParamsToSend) > 0)
				{
					for ( var paramToSend in $_arrayOfParamsToSend)
						addArrayOfParamsToSendResult &= this.addToParamsToSend($_arrayOfParamsToSend[paramToSend]);
					if (isTrue(addArrayOfParamsToSendResult))
						return this.displayLog('addArrayOfParamsToSend', $_arrayOfParamsToSend, !addArrayOfParamsToSendResult);
					else
						return !this.displayLog('addArrayOfParamsToSend', $_arrayOfParamsToSend, !addArrayOfParamsToSendResult);
				}
				else
					return !this.displayLog('addArrayOfParamsToSend', 'Le paramétre passé n\'est pas un tableau', true);
			};
			/**
			 * Méthode exécutant la requete à la maniére du webservice pour yahoo
			 * Ajout du script généré par yahoo dans le head de la page
			 *
			 * @return bool true|false si erreur
			 */
			this.sendRequest = function sendRequest()
			{
				var httpRequest = this.getHttpRequest();
				if (isset(httpRequest))
				{
					switch (this.getCallType())
					{
						case this.REST:
							var script = document.createElement("script");
							script.type = "text/javascript";
							script.charset = "UTF-8";
							script.src = httpRequest;
							document.getElementsByTagName('HEAD')[0].appendChild(document.createTextNode("\n"));
							document.getElementsByTagName('HEAD')[0].appendChild(script);
							return this.displayLog("sendRequest", "Exécution de la requete REST :" + httpRequest);
							break;
						case this.AJAX:
							var ajaxObject = new N.AjaxObject(this.getDisplayDebug());
							ajaxObject.setHttpUrl(httpRequest);
							ajaxObject.setHttpMethod(this.getHttpMethod());
							ajaxObject.startRequest();
							return this.displayLog("sendRequest", "Exécution de la requete Ajax :" + httpRequest);
							break;
						default:
							return !this.displayLog("sendRequest", "Erreur de définition du mode de requetage : '" + this.getCallType() + "'");
							break;
					}
				}
				else
					return !this.displayLog("sendRequest", "Arret suite erreur de définition de la requete : '" + httpRequest + "'", true);
			};
			/**
			 * Méthode par défaut de réception de la réponse du WebService
			 *
			 * @param object la réponse du WebService
			 * @return bool true
			 */
			this.receiveResponse = function receiveResponse($_response)
			{
				this.decrIndex();
				this.displayLog('receiveResponse', $_response);
			};
			/**
			 * Méthode de test de propriété erreur d'une réponse à un appel du service Niouseo
			 * @param $_response Object l'objet de la réponse
			 * @return bool true s'il y une erreur|false
			 */
			this.responseIsError = function responseIsError($_response)
			{
				return (!keyInArray('responseIsError', $_response) || (keyInArray('responseIsError', $_response) && isTrue($_response.responseIsError)));
			};
			this.rIsError = this.responseIsError;
			/**
			 * Méthode de récupération de la propriété content d'une réponse à une appel du service Niouseo
			 * @param $_response Object l'obejt de la réponse
			 * @return mixed|null
			 */
			this.getResponseContent = function getResponseContent($_response)
			{
				return keyInArray('responseContent', $_response) ? $_response.responseContent : null;
			};
			this.rContent = this.getResponseContent;
			/**
			 * Méthode de récupération de la valeur du contexte d'une réponse à une appel du service Niouseo
			 * @param $_response Object objet de la réponse
			 * @return mixed|null
			 */
			this.getResponseContext = function getResponseContext($_response)
			{
				return keyInArray('responseContext', $_response) ? $_response.responseContext : null;
			};
			this.rContext = this.getResponseContext;
			/**
			 * Méthode permettant de définir le nom de la méhode en charge de la réponse.
			 * Par défaut, c'est l'attribut name qui sert à définir l'objet en charge de la réponse
			 * @param $_methodName string le nom de la méthode
			 * @param $_objectName string optional le nom de la variable Javascript utilisée 
			 * @return
			 */
			this.defineCallback = function defineCallback($_methodName)
			{
				this.displayLog('receiveResponse', Array($_methodName, arguments[1]));
				var objectName = isset(arguments[1]) ? arguments[1] : this.getName();
				return this.setCallback(objectName + '.' + $_methodName);
			};
			/**
			 * Méthode d'instanciation de l'objet
			 *
			 * @param $_DisplayDebug bool optional true|false pour activer le debug
			 * @return Caller object
			 */
			this._construct = function _construct(/*bool $_DisplayDebug*/)
			{
				N.registerProperty(this, 'CALLER', 'Caller');
				/**
				 * Méthode de requetages possibles
				 *	- AJAX : ajax à l'aide de YAHOO
				 *	- REST : requetes rest avec création de balises script dans le HEAD de la page
				 */
				N.registerProperty(this, 'AJAX', 'ajax');
				N.registerProperty(this, 'REST', 'rest');
				/**
				 * Modes d'envoi des données
				 *	- GET_METHOD : en get
				 *	- POST_METHOD : en post
				 */
				N.registerProperty(this, 'GET_METHOD', 'get');
				N.registerProperty(this, 'POST_METHOD', 'post');
				if (this.toString() == this.CALLER)
					this.superclass._construct.apply(this, arguments);
				else
					this.getSuper()._construct.apply(this, arguments);
				this.initVars();
				if (parent.location.hostname == N.INTERN_SERVER_URL)
					this.setUrl(location.protocol + '//' + N.INTERN_SERVER_URL + N.MAIN_PATH + N.SCRIPT_TO_CALL + '?');
				else
					this.setUrl(location.protocol + '//' + N.EXTERN_SERVER_URL + N.MAIN_PATH + N.SCRIPT_TO_CALL + '?');
				this.setHostname(parent.location.hostname);
				this.setParamsToSend(new Array( { 'type' : 'STRING', 'name' : N.CONTEXT_KEY, 'getMethod' : 'this.getNiouseoContextToCall' }, { 'type' : 'STRING', 'name' : N.MODE_KEY, 'getMethod' : 'this.getNiouseoModeToCall' }, { 'type' : 'STRING', 'name' : 'context', 'getMethod' : 'this.getContext' }, { 'type' : 'STRING', 'name' : 'callback', 'getMethod' : 'this.getCallback' }, { 'type' : 'STRING', 'name' : 'output', 'getMethod' : 'this.getOutput' }, { 'type' : 'STRING', 'name' : 'mode', 'getMethod' : 'this.getMode' }, { 'type' : 'STRING', 'name' : 'id', 'getMethod' : 'this.getId' }, { 'type' : 'STRING', 'name' : 'cookie', 'getMethod' : 'this.getCookie' }, { 'type' : 'STRING', 'name' : 'name', 'getMethod' : 'this.getName' }, { 'type' : 'STRING', 'name' : 'hostname', 'getMethod' : 'this.getHostname' }));
				this.displayLog('_construct', 'Init de ' + this.toString());
				return this;
			};
			this._construct(arguments[0]);
		};
		/**
		 * Héritage de la classe
		 */
		N.extend(Caller, N.EventManager);
		N.registerProperty(N, 'Caller', Caller);
	})();
}
