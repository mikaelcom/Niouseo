/**
 * @package Niouseo
 * @subpackage NiouseoAttributeFactory
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
		 * Classe de construction d'attribut de classe et de leurs méthodes.
		 * Le nom du champ doit respecter la casse camelCasse.
		 * Les méthodes sont aussi bien celles de :
		 *	- définition de la valeur de l'atribut
		 *  - récupération de la valeur de l'attribut
		 *	- d'association de l'attribut à un champ d'une interface 
		 *		(définissant l'événement sur le champ de l'interface selon son type et 
		 *		permettant de définir la valeur de l'atribut associé dés que l'événement adapté au champ survient)
		 */
		var AttributeFactory = function AttributeFactory()
		{
			this.classInfo = { 'appName' : 'AttributeFactory', 'version' : '1.0', 'copyright' : 'Mikaël DELSOL', 'author' : 'Mikaël DELSOL', 'date' : '26/09/08' };
			N.registerProperty(this, 'ATTRIBUTEFACTORY', 'AttributeFactory');
			/**
			 * Nom de la classe de l'objet
			 * Attribut non modifiable
			 * @return string
			 */
			this.toString = function toString()
			{
				return this.ATTRIBUTEFACTORY;
			};
			/**
			 * Objet pour lequel il fau ajouter les attributs
			 * @var object
			 */
			this.object = {};
			/**
			 * Nom de l'attribut à ajouter à l'objet
			 * @var string
			 */
			this.attributeName = '';
			/**
			 * Valeur par défaut de l'attribut de l'objet
			 * @var mixed
			 */
			this.defaultAttributeValue = '';
			/**
			 * Tableau des attributs générés pour la classe possédant ce générateur d'attributs
			 * @var array
			 */
			this.attributes = new Array();
			/**
			 * Méthode de défintion de l'objet
			 *
			 * @param $_object object l'objet
			 * @return bool true
			 */
			this.setObject = function setObject(/*string*/$_object)
			{
				/**
				 * Si l'objet ne posséde pas la méthode displayLog, alors on le fait hériter de la classe générique
				 * On duplqiue l'objet afin de lui rappliquer ses attributs par la suite
				 */
				if (isObject($_object))
				{
					if (!isset($_object.displayLog))
					{
						N.extend($_object, N.NiouseoGen);
						$_object = new $_object;
						$_object._construct();
					}
					this.object = $_object;
					if (!keyInArray(this.object.toString(), this.getAttributes()))
						this.getAttributes()[this.object.toString()] = new Array();
					return this.displayLog('setObject', $_object);
				}
				else
					return !this.displayLog('setObject', $_object, true);
			};
			/**
			 * Méthode de récupération de l'objet 
			 *
			 * @return object l'objet
			 */
			this.getObject = function getObject()
			{
				return this.object;
			};
			/**
			 * Méthode de défintion du nom de l'attribut
			 *
			 * @param string le nom de l'attribut
			 * @return bool true
			 */
			this.setAttributeName = function setAttributeName(/*string*/$_attributeName)
			{
				this.attributeName = $_attributeName;
				return this.displayLog('setAttributName', $_attributeName);
			};
			/**
			 * Méthode de récupération de l'attribut 
			 *
			 * @return string le nom de l'attribut
			 */
			this.getAttributeName = function getAttributeName()
			{
				return this.attributeName;
			};
			/**
			 * Méthode de définition du tableau des attributs définis pour la classe possédant l'objet
			 * @uses displayLog()
			 * @param $_attributes array le tableau
			 * @return bool truetrue
			 */
			this.setAttributes = function setAttributes(/*array*/$_attributes)
			{
				this.attributes = $_attributes;
				return this.displayLog('setAttributes', $_attributes);
			};
			/**
			 * Méthode de récupération du tableau des attributs de la classes
			 * @return array
			 */
			this.getAttributes = function getAttributes()
			{
				return this.attributes;
			};
			/**
			 * Méthode permettatn à un objet de récupérer ses propres attributs qu'il a défini
			 * @return array|null
			 */
			this.getAttributesOfMe = function getAttributesOfMe()
			{
				if (isset(this.getObject()) && keyInArray(this.getObject().toString(), this.getAttributes()))
					return this.getAttributes()[this.getObject().toString()];
				else
					return null;
			};
			/**
			 * Méthode de défintion de al valeur par défaut de l'attribut
			 *
			 * @param $_defaultAttributeValue mixed la valeur par défaut
			 * @return bool true
			 */
			this.setDefaultAttributeValue = function setDefaultAttributeValue(/*string*/$_defaultAttributeValue)
			{
				this.defaultAttributeValue = $_defaultAttributeValue;
				return this.displayLog('setDefaultAttributeValue', $_defaultAttributeValue);
			};
			/**
			 * Méthode de récupération de la valeur par défaut de l'attribut 
			 *
			 * @return mixed la valeur par défaut
			 */
			this.getDefaultAttributeValue = function getDefaultAttributeValue()
			{
				return this.defaultAttributeValue;
			};
			/**
			 * Méthode de récupération de l'aide sur les méthodes générées dynamiquement
			 * @param $_methodName string nom générique de la méthode
			 * @return string
			 */
			this.getMethodHelp = function getMethodHelp($_methodName)
			{
				var help = '';
				switch ($_methodName)
				{
					case 'addToMethod':
						help += 'Add $_value to the object/array at the position $_index';
						help += "\r\n" + 'addToMethod($_index,$_value)';
						help += "\r\n" + '$_index scalar position to place the value';
						help += "\r\n" + '$_value mixed value at the position of $_index';
						help += "\r\n" + 'return bool true if attribute is array|false if not';
						break;
					case 'joinAttribute':
					case 'implodeAttribute':
						help += 'Join array elements with a $_separator string';
						help += "\r\n" + 'joinAttribute($_separator)';
						help += "\r\n" + '$_separator string value separator';
						help += "\r\n" + 'return string values sticked together by $_separator if attribute is array|null if not';
						break;
					case 'pushAttribute':
						help += 'Push one or more elements onto the end of array';
						help += "\r\n" + 'pushAttribute($_element1 [, ..., $_element_n])';
						help += "\r\n" + '$_element1 string value to add';
						help += "\r\n" + '$_element_n string value to add';
						help += "\r\n" + 'return string values sticked together by $_separator if attribute is array|null if not';
						break;
					case 'sliceAttribute':
						help += 'Extract a slice of the array';
						help += "\r\n" + 'sliceAttribute($_offset,$_length)';
						help += "\r\n" + '$_offset int start at that offset in the array';
						help += "\r\n" + '$_length int number of elements to extract from $_offset';
						help += "\r\n" + 'return the sequence of elements from the array as specified by the $_offset and $_length parameters if attribute is array|null if not';
						break;
					case 'unshiftAttribute':
						help += 'Prepend one or more elements to the beginning of the array';
						help += "\r\n" + 'unshiftAttribute($_element1 [, ..., $_element_n])';
						help += "\r\n" + '$_element1 string value to add';
						help += "\r\n" + '$_element_n string value to add';
						help += "\r\n" + 'return the new number of elements in the array|null if not';
						break;
					default:
						help = 'No help defined for "' + $_methodName + '"';
						break;
				}
				return help;
			};
			/**
			 * Méthode permettant de savoir si l'aide est demandée sur la méthode générée dynamiquement
			 * @param $_methodArguments Object les arguments de la méthode appelée
			 * @return bool true|false
			 */
			this.helpIsAsked = function helpIsAsked($_methodArguments)
			{
				return (isObject($_methodArguments) && $_methodArguments[0] == '?' && isTrue($_methodArguments[1]));
			};
			/**
			 * Cette méthode se charge uniquement de retourner le nom de l'attribut avec la premiére lettre en amjuscule afin de générer l'accesseur et le définisseur
			 * 
			 * @return string le nom de l'attribut redéfini 
			 */
			this.getCamelCaseAttributeName = function getCamelCaseAttributeName($_attributeName)
			{
				return getCamelCaseForm($_attributeName);
			};
			/**
			 * Méthode permattant de récupérer le nom de la méthode get pour l'attribut
			 *
			 * @param string le nom de l'attribut
			 * @return string nom de la méthode
			 */
			this.getGetMethodName = function getGetMethodName($_attributeName)
			{
				return 'get' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permattant de récupérer le nom de la méthode set pour l'attribut
			 *
			 * @param string le nom de l'attribut
			 * @return string nom de la méthode
			 */
			this.getSetMethodName = function getSetMethodName($_attributeName)
			{
				return 'set' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permattant de récupérer le nom de la méthode addTo pour l'attribut
			 *
			 * @param string le nom de l'attribut
			 * @return string nom de la méthode
			 */
			this.getAddToMethodName = function getAddToMethodName($_attributeName)
			{
				return 'addTo' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permattant de récupérer le nom de la méthode getElementOf pour l'attribut
			 *
			 * @param string le nom de l'attribut
			 * @return string nom de la méthode
			 */
			this.getGetElementOfAttributeAtMethodName = function getGetElementOfAttributeAtMethodName($_attributeName)
			{
				return 'getElementOf' + this.getCamelCaseAttributeName($_attributeName) + 'At';
			};
			/**
			 * Méthode permattant de récupérer le nom de la méthode getIndexOfElementIn pour l'attribut
			 *
			 * @param string le nom de l'attribut
			 * @return string nom de la méthode
			 */
			this.getGetIndexOfElementInAttributeMethodName = function getGetIndexOfElementInAttributeMethodName($_attributeName)
			{
				return 'getIndexOfElementIn' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant de supprimer un élément du tableau par son index
			 *
			 * @param mixed l'index dans le tableau
			 * @return string nom de la méthode
			 */
			this.getDeleteElementOfAttributeByIndexMethodName = function getDeleteElementOfAttributeByIndexMethodName($_attributeName)
			{
				return 'deleteElementOf' + this.getCamelCaseAttributeName($_attributeName) + 'ByIndex';
			};
			/**
			 * Méthode permettant de supprimer un élément du tableau par sa valeur
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getDeleteElementOfAttributeByElementMethodName = function getDeleteElementOfAttributeByElementMethodName($_attributeName)
			{
				return 'deleteElementOf' + this.getCamelCaseAttributeName($_attributeName) + 'ByElement';
			};
			/**
			 * Méthode permettant de récupérer le nombre d'élément de l'attribut
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getAttributeLengthMethodName = function getAttributeLengthMethodName($_attributeName)
			{
				return 'get' + this.getCamelCaseAttributeName($_attributeName) + 'Length';
			};
			/**
			 * Méthode permettant de récupérer le nombre d'élément de l'attribut
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getCountAttributeMethodName = function getCountAttributeMethodName($_attributeName)
			{
				return 'count' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant de récupérer les éléments au format chaine de caractéres listés séparés par un séparateur
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getJoinAttributeMethodName = function getJoinAttributeMethodName($_attributeName)
			{
				return 'join' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant de récupérer les éléments au format chaine de caractéres listés séparés par un séparateur
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getImplodeAttributeMethodName = function getImplodeAttributeMethodName($_attributeName)
			{
				return 'implode' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant de supprimer le dernier élément du tableau
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getPopAttributeMethodName = function getPopAttributeMethodName($_attributeName)
			{
				return 'pop' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant d'ajouter des éléments en fin de tableau.
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getPushAttributeMethodName = function getPushAttributeMethodName($_attributeName)
			{
				return 'push' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant d'inverser complétement l'ordre des éléments du tableau. Le premier élément se retrouve en dernier et inversement.
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getReverseAttributeMethodName = function getReverseAttributeMethodName($_attributeName)
			{
				return 'reverse' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant de supprimer le premier élément du tableau.
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getShiftAttributeMethodName = function getShiftAttributeMethodName($_attributeName)
			{
				return 'shift' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant de retourner une tranche de tableau composé des éléments ayant un indice supérieur ou égal à debut et strictement inférieur à fin.
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getSliceAttributeMethodName = function getSliceAttributeMethodName($_attributeName)
			{
				return 'slice' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant de trier les éléments par ordre croissant ou alphabétique croissant.
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getSortAttributeMethodName = function getSortAttributeMethodName($_attributeName)
			{
				return 'sort' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Méthode permettant d'insérer des éléments en début de tableau.
			 *
			 * @param mixed l'élément du tableau
			 * @return string nom de la méthode
			 */
			this.getUnshiftAttributeMethodName = function getUnshiftAttributeMethodName($_attributeName)
			{
				return 'unshift' + this.getCamelCaseAttributeName($_attributeName);
			};
			/**
			 * Objet pour lequel doit étre défini les méthodes de l'attribut
			 *
			 * @param string le nom de l'attribute à ajouter à l'objet
			 * @param mixed optional sa valeur par défaut
			 * @return bool true si l'objet en paramétre est bien un objet, false le cas contraire
			 */
			this.appendAttribute = function appendAttribute(/*attribute*/$_attributeName/*mixed $_attributeDefaultValue*/)
			{
				if (isObject(this.getObject()))
				{
					var me = this;
					addValueToArray(this.getAttributes()[this.getObject().toString()], arguments[1], $_attributeName);
					/**
					 * Renseignement de l'attribut à ajouter
					 */
					this.setAttributeName($_attributeName);
					var attributeName = this.getAttributeName();
					/**
					 * La premiére méthode est celle permettant de définir la valeur de l'attribut et devant permettr de suivre sa définition
					 * Celle-ci ne prend pas actuellement en charge de vérifier selon le type de l'attribut la valeur passée en paramétre
					 */
					/**
					 * Ajout de la méthode de définition
					 */
					var setMethodName = this.getSetMethodName(this.getAttributeName());
					if (!isset(this.getObject()[setMethodName]))
					{
						var setMethod = function setMethod($_paramValue)
						{
							this[attributeName] = $_paramValue;
							return this.displayLog(setMethodName, $_paramValue);
						};
						N.registerProperty(this.getObject(), setMethodName, eval(setMethod));
					}
					/**
					 * Ajout de la méthode de récupération de la valeur de l'attribut 
					 */
					var getMethodName = this.getGetMethodName(this.getAttributeName());
					if (!isset(this.getObject()[getMethodName]))
					{
						var getMethod = function getMethod()
						{
							return this[attributeName];
						};
						N.registerProperty(this.getObject(), getMethodName, eval(getMethod));
					}
					/**
					 * Si la valeur par défaut est défnie et que celle-ci est de type array, alors on ajoute la méthode addTo"AttributeName"
					 * permettant d'ajouter des valeurs au tableau à l'aide d'un index et de la valeur
					 */
					if (isset(arguments[1]))
					{
						/**
						 * Définition de la valeur par défaut de l'attribut de la classe
						 */
						this.setDefaultAttributeValue(arguments[1]);
						/**
						 * Si array, on ajoute la/les méthodes spécifiques relative(s) au tableau
						 */
						if (isArray(this.getDefaultAttributeValue()) || isObject(this.getDefaultAttributeValue()))
						{
							var addMethodName = this.getAddToMethodName(this.getAttributeName());
							if (!isset(this.getObject()[addMethodName]))
							{
								var addToMethod = function addToMethod($_index, $_value)
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('addToMethod');
									if (isArray(this[attributeName]))
									{
										this[attributeName][$_index] = $_value;
										return true;
									}
									else
										return !true;
								};
								N.registerProperty(this.getObject(), addMethodName, eval(addToMethod));
							}
							var getElementOfAttributeAtMethodName = this.getGetElementOfAttributeAtMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getElementOfAttributeAtMethodName]))
							{
								var getElementOfAttributeAt = function getElementOfAttributeAt($_index)
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('getElementOfAttributeAt');
									if ($_index !== '' && keyInArray($_index, this[attributeName]))
									{
										this.displayLog(getElementOfAttributeAtMethodName, $_index);
										return this[attributeName][$_index];
									}
									else
										return null;
								};
								N.registerProperty(this.getObject(), getElementOfAttributeAtMethodName, eval(getElementOfAttributeAt));
							}
							var getGetIndexOfElementInAttributeMethodName = this.getGetIndexOfElementInAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getGetIndexOfElementInAttributeMethodName]))
							{
								var getIndexOfElementInAttribute = function getIndexOfElementInAttribute($_element)
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('getIndexOfElementInAttribute');
									if (inArray($_element, this[attributeName]))
									{
										this.displayLog(getGetIndexOfElementInAttributeMethodName, $_element);
										for ( var index in this[attributeName])
										{
											if (this[attributeName][index] === $_element)
												break;
										}
										return index;
									}
									else
										return null;
								};
								N.registerProperty(this.getObject(), getGetIndexOfElementInAttributeMethodName, eval(getIndexOfElementInAttribute));
							}
							var getDeleteElementOfAttributeByIndexMethodName = this.getDeleteElementOfAttributeByIndexMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getDeleteElementOfAttributeByIndexMethodName]))
							{
								var deleteElementOfAttributeByIndex = function deleteElementOfAttributeByIndex($_index)
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('deleteElementOfAttributeByIndex');
									if ($_index !== '' && keyInArray($_index, this[attributeName]))
									{
										this.displayLog(getDeleteElementOfAttributeByIndexMethodName, $_index);
										delete this[attributeName][$_index];
										if (count(this[attributeName]) == 0 && isArray(this[attributeName]))
											this[attributeName] = new Array();
										else
										{
											if (count(this[attributeName]) == 0 && isObject(this[attributeName]))
												this[attributeName] = new Object();
										}
										return !keyInArray($_index, this[attributeName]);
									}
									else
										return !true;
								};
								N.registerProperty(this.getObject(), getDeleteElementOfAttributeByIndexMethodName, eval(deleteElementOfAttributeByIndex));
							}
							var getDeleteElementOfAttributeByElementMethodName = this.getDeleteElementOfAttributeByElementMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getDeleteElementOfAttributeByElementMethodName]))
							{
								var deleteElementOfAttributeByElement = function deleteElementOfAttributeByElement($_element)
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('deleteElementOfAttributeByElement');
									if (inArray($_element, this[attributeName]))
									{
										this.displayLog(getDeleteElementOfAttributeByElementMethodName, $_element);
										var index = this[getGetIndexOfElementInAttributeMethodName]($_element);
										if (isset(index))
										{
											delete this[attributeName][index];
											if (count(this[attributeName]) == 0 && isArray(this[attributeName]))
												this[attributeName] = new Array();
											else
											{
												if (count(this[attributeName]) == 0 && isObject(this[attributeName]))
													this[attributeName] = new Object();
											}
											return true;
										}
										else
											return !true;
									}
									else
										return !true;
								};
								N.registerProperty(this.getObject(), getDeleteElementOfAttributeByElementMethodName, eval(deleteElementOfAttributeByElement));
							}
							var getLengthMethodName = this.getAttributeLengthMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getLengthMethodName]))
							{
								var getAttributeLength = function getAttributeLength()
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('addToMethod');
									if (isArray(this[attributeName]))
										return count(this[attributeName]);
									else
										return null;
								};
								N.registerProperty(this.getObject(), getLengthMethodName, eval(getAttributeLength));
								N.registerProperty(this.getObject(), this.getCountAttributeMethodName(this.getAttributeName()), eval(getAttributeLength));
							}
							var getJoinMethodName = this.getJoinAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getJoinMethodName]))
							{
								var joinAttribute = function joinAttribute($_join)
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('joinAttribute');
									if (isArray(this[attributeName]))
										return this[attributeName].join($_join);
									else
										return null;
								};
								N.registerProperty(this.getObject(), getJoinMethodName, eval(joinAttribute));
								N.registerProperty(this.getObject(), this.getImplodeAttributeMethodName(this.getAttributeName()), eval(joinAttribute));
							}
							var getPopMethodName = this.getPopAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getPopMethodName]))
							{
								var popAttribute = function popAttribute()
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('addToMethod');
									if (isArray(this[attributeName]))
										return this[attributeName].pop();
									else
										return null;
								};
								N.registerProperty(this.getObject(), getPopMethodName, eval(popAttribute));
							}
							var getReverseMethodName = this.getReverseAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getReverseMethodName]))
							{
								var reverseAttribute = function reverseAttribute()
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('addToMethod');
									if (isArray(this[attributeName]))
										return this[attributeName].reverse();
									else
										return null;
								};
								N.registerProperty(this.getObject(), getReverseMethodName, eval(reverseAttribute));
							}
							var getShiftMethodName = this.getShiftAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getShiftMethodName]))
							{
								var shiftAttribute = function shiftAttribute()
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('addToMethod');
									if (isArray(this[attributeName]))
										return this[attributeName].shift();
									else
										return null;
								};
								N.registerProperty(this.getObject(), getShiftMethodName, eval(shiftAttribute));
							}
							var getSortMethodName = this.getSortAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getSortMethodName]))
							{
								var sortAttribute = function sortAttribute()
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('addToMethod');
									if (isArray(this[attributeName]))
										return this[attributeName].sort();
									else
										return null;
								};
								N.registerProperty(this.getObject(), getSortMethodName, eval(sortAttribute));
							}
							var getPushMethodName = this.getPushAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getPushMethodName]))
							{
								var pushAttribute = function pushAttribute()
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('pushAttribute');
									if (isArray(this[attributeName]))
									{
										var argumentsToPush = arguments;
										var nbArgumentsToPush = argumentsToPush.length;
										if (isArray(argumentsToPush) || isObject(argumentsToPush))
										{
											for ( var i = 0; i < nbArgumentsToPush; i++)
												this[attributeName].push(argumentsToPush[i]);
											return this[attributeName];
										}
										return this[attributeName];
									}
									else
										return null;
								};
								N.registerProperty(this.getObject(), getPushMethodName, eval(pushAttribute));
							}
							var getSliceMethodName = this.getSliceAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getSliceMethodName]))
							{
								var sliceAttribute = function sliceAttribute($_start, $_end)
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('sliceAttribute');
									if (isArray(this[attributeName]))
										return this[attributeName].slice($_start, $_end);
									else
										return null;
								};
								N.registerProperty(this.getObject(), getSliceMethodName, eval(sliceAttribute));
							}
							var getUnshiftMethodName = this.getUnshiftAttributeMethodName(this.getAttributeName());
							if (!isset(this.getObject()[getUnshiftMethodName]))
							{
								var unshiftAttribute = function unshiftAttribute()
								{
									if (me.helpIsAsked(arguments))
										return me.getMethodHelp('unshiftAttribute');
									if (isArray(this[attributeName]))
									{
										var argumentsToUnshift = arguments;
										var nbArgumentsToUnshift = argumentsToUnshift.length;
										if (isArray(argumentsToUnshift) || isObject(argumentsToUnshift))
										{
											for ( var i = nbArgumentsToUnshift - 1; i >= 0; i--)
												this[attributeName].unshift(argumentsToUnshift[i]);
											return this[attributeName];
										}
										return this[attributeName];
									}
									else
										return null;
								};
								N.registerProperty(this.getObject(), getUnshiftMethodName, eval(unshiftAttribute));
							}
						}
					}
					/**
					 * Ajout de l'attribut à l'objet en question
					 */
					if (!isset(this.getObject()[this.getAttributeName()]) || isset(arguments[2]))
						N.registerProperty(this.getObject(), this.getAttributeName(), this.getDefaultAttributeValue());
					return this.displayLog('appendAttribute', this.getAttributeName());
				}
				else
					return !this.displayLog('appendAttribute', this.getObject(), true);
			};
			/**
			 * Méthode permettant d'ajouter un tableau d'attributs d'un seul coup 
			 * Pour cela passer un tableau d'objet simple ayant pour attribut :
			 * 	- name : le nom de l'attribut
			 *	- default : optional, la valeur par défaut de l'attribut
			 *
			 * @param array d'objets d'attrbuts
			 * @return bool true si tout ok, false dans le cas contraire
			 */
			this.appendArrayOfAttributes = function appendArrayOfAttributes(/*array*/$_arrayOfAttributes)
			{
				if (isArray($_arrayOfAttributes))
				{
					for ( var attributeObject in $_arrayOfAttributes)
						this.appendAttribute($_arrayOfAttributes[attributeObject]['name'], $_arrayOfAttributes[attributeObject]['default']);
					return this.displayLog('appendArrayOfAttributes', $_arrayOfAttributes);
				}
				else
					return !this.displayLog('appendArrayOfAttributes', $_arrayOfAttributes, true);
			};
			this._construct(arguments[0]);
		};
		/**
		 * Héritage de la classe
		 */
		N.extend(AttributeFactory, N.NiouseoGen);
		N.registerProperty(N, 'AttributeFactory', AttributeFactory);
	})();
}
