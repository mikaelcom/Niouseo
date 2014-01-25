/**
 * Fiche de définition des variables globales utiles aux classes et propre au serveur et à l'utilisateur 
 * @package Niouseo
 * @subpackage Niouseo
 * @author Mikaël DELSOL
 * @copyright Mikaël DELSOL
 * @version 1.0
 * @date 25/09/2008 
 */
if (typeof NIOUSEO == 'undefined')
	var NIOUSEO = function NIOUSEO()
	{
	};
if (typeof isset != 'undefined' && isset(NIOUSEO))
{
	(function()
	{
		var N = NIOUSEO.prototype;
		/**
		 * Url interne du serveur hébergeant la solution
		 */
		N.INTERN_SERVER_URL = location.hostname;
		/**
		 * Url extérieure du serveur hébergeant la solution
		 */
		N.EXTERN_SERVER_URL = location.hostname;
		/**
		 * Chemin principal vers les dossiers de l'application (comme dans common.inc)
		 */
		N.MAIN_PATH = location.pathname.replace(/(\w*.php)/, '').replace(/(\w*.html)/, '');
		/**
		 * Point d'entrée du WebService
		 */
		N.SCRIPT_TO_CALL = 'niouseo.php';
		/**
		 * Chemin vers le dossier de JS
		 */
		N.JS_PATH = 'JS/';
		/**
		 * Chemin vers le dossier de Images
		 */
		N.IMG_PATH = 'Images/';
		/**
		 * Chemin vers le dossier de Images
		 */
		N.IMAGES_PATH = N.IMG_PATH;
		/**
		 * Chemin vers le dossier de PHP
		 */
		N.PHP_PATH = 'PHP/';
		/**
		 * Chemin vers le dossier de HTML
		 */
		N.HTML_PATH = 'HTML/';
		/**
		 * Chemin vers le dossier de CSS
		 */
		N.CSS_PATH = 'CSS/';
		/**
		 * Chemin vers le dossier de Config
		 */
		N.CONFIG_PATH = 'Config/';
		/**
		 * Chemin vers le dossier des modules
		 */
		N.MODULES_PATH = 'Modules/';
		/**
		 * Attribut définissant le module utilisé
		 */
		N.CONTEXT_KEY = 'module';
		/**
		 * Attribut définissant l'action/la méthode appelée
		 */
		N.MODE_KEY = 'action';
	})();
}
