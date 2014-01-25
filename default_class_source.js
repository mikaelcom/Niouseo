( function()
{
	/**
	 * Raccourci vers la définition du prototype de la classe
	 */
	var N = NIOUSEO.prototype;
	/**
	 * Définition de la variable représentant une nouvelle classe
	 */
	var DefaultClass = function DefaultClass()
	{
		this.classInfo = { 'appName' : 'DefaultClass', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '19/04/08' };
		/**
		 * "Constante" de classe définissant le nom de la classe utilisée par la méthode toString()
		 */
		N.registerProperty(this, 'DEFAULTCLASS', 'DefaultClass');
		/**
		 * Méthode d'initialisation des attributs de la classe et leur valeur par défaut
		 * @uses displayLog()
		 * @uses getAttributeFactory()
		 * @uses AttributeFactory::setObject()
		 * @return bool true
		 */
		this.initVars = function initVars()
		{
			this.getAttributeFactory().setObject(this);
			this.displayLog('initVars', 'Appel de la méthode');
		};
		/**
		 * Méthode retournant le nom de la classe
		 * @return string this.DEFAULTCLASS
		 */
		this.toString = function toString()
		{
			return this.DEFAULTCLASS;
		};
		/**
		 * Méthode constrcuteur de la classe
		 * @return bool optional la valeur pour activer les debug ou non
		 * @return DefaultClass
		 */
		this._construct = function _constrcut(/*bool $_displayDebug*/)
		{
			if (this.toString() == this.DEFAULTCLASS)
				this.superclass._construct.apply(this, arguments);
			this.initVars();
			return this;
		};
	};
	N.extend(DefaultClass, N.gen);
})();
