idrinth.ui = {
    tooltip: null,
    formatNumber: function ( number ) {
        if ( isNaN ( number ) ) {
            return '';
        }
        var count = 0;
        var post = [ '', 'k', 'm', 'b', 't', 'qa', 'qi', 's' ];
        while ( number > 999 && count < post.length ) {
            number = Math.round ( number / 10 ) / 100;
            count++;
        }
        return number.toString () + post[count];
    },
    buildChat: function ( id, name, rank, pass ) {
        if ( !idrinth.chat.elements.chats ) {
            window.setTimeout ( function () {
                idrinth.ui.buildChat ( id, name, rank, pass );
            }, 500 );
        }
        idrinth.chat.elements.chats.appendChild ( idrinth.ui.buildElement ( {
            type: 'li',
            id: 'idrinth-chat-tab-' + id,
            css: rank.toLowerCase (),
            attributes: [
                {
                    name: 'data-id',
                    value: id
                }
            ],
            children: [
                {
                    type: 'ul',
                    css: "styled-scrollbar users"
                },
                {
                    type: 'ul',
                    css: "styled-scrollbar chat"
                },
                {
                    type: 'input',
                    css: 'add-chat-box',
                    id: "idrinth-chat-input-" + id,
                    attributes: [
                        {
                            name: 'title',
                            value: 'press ENTER or RETURN to send'
                        },
                        {
                            name: 'onkeyup',
                            value: 'if(event.keyCode===13||event.which===13){idrinth.chat.send(' + id + ');}'
                        }
                    ]
                }
            ]
        } ) );
        idrinth.chat.elements.menu.appendChild (
                idrinth.ui.buildElement (
                        {
                            type: 'li',
                            content: name,
                            id: 'idrinth-chat-tab-click-' + id,
                            attributes: [
                                {
                                    name: 'data-id',
                                    value: id
                                },
                                {
                                    name: 'title',
                                    value: name + "\nID:" + id + "\nPassword: " + pass
                                },
                                {
                                    name: 'onclick',
                                    value: 'idrinth.chat.enableChat(this);'
                                },
                                {
                                    name: 'oncontextmenu',
                                    value: 'idrinth.chat.showOptions(event,this);'
                                }
                            ]
                        }
                )
                );
    },
    getElementPositioning: function ( element, offsetX, offsetY ) {
        var pos = {
            x: element.getBoundingClientRect ().left + ( offsetX ? offsetX : 0 ),
            y: element.getBoundingClientRect ().top + ( offsetY ? offsetY : 0 )
        };
        return 'position:fixed;left:' + pos.x + 'px;top:' + pos.y + 'px';
    },
    buildElement: function ( config ) {
        'use strict';
        var setBase = function ( el, config ) {
            if ( config.id ) {
                el.id = config.id;
            }
            if ( config.css ) {
                el.setAttribute ( 'class', config.css );
            }
            if ( config.content ) {
                el.appendChild ( document.createTextNode ( config.content ) );
            }
        };
        var addChildren = function ( el, config ) {
            if ( !config.children || !config.children.length ) {
                return;
            }
            for (var count = 0, l = config.children.length; count < l; count++) {
                el.appendChild ( idrinth.ui.buildElement ( config.children[count] ) );
            }
        };
        var addAttributes = function ( el, config ) {
            if ( !config.attributes || !config.attributes.length ) {
                return;
            }
            for (var count = 0, l = config.attributes.length; count < l; count++) {
                if ( config.attributes[count].name && config.attributes[count].value !== undefined ) {
                    el.setAttribute ( config.attributes[count].name, config.attributes[count].value );
                }
            }
        };
        var makeInputLabel = function ( config ) {
            'use strict';
            var inArray = function ( value, list ) {
                'use strict';
                if ( !Array.isArray ( list ) ) {
                    return false;
                }
                if ( typeof list.includes === 'function' ) {
                    return list.includes ( value );
                }
                return list.indexOf ( value ) > -1;
            };
            var input = [ {
                    name: 'type',
                    value: config.type
                } ];
            if ( idrinth.settings[config.name] && config.type === 'checkbox' ) {
                input.push ( {
                    name: 'checked',
                    value: 'checked'
                } );
            }
            if ( config.type !== 'checkbox' ) {
                input.push ( {
                    name: 'value',
                    value: idrinth.settings[config.name]
                } );
                input.push ( {
                    name: 'onchange',
                    value: 'idrinth.settings.change(\'' + config.name + '\',this.value)'
                } );
            } else {
                input.push ( {
                    name: 'onchange',
                    value: 'idrinth.settings.change(\'' + config.name + '\',this.checked)'
                } );
            }
            return idrinth.ui.buildElement ( {
                css: 'idrinth-line' + ( config.platforms && !inArray ( idrinth.platform, config.platforms ) ? ' idrinth-hide' : '' ),
                children: [ {
                        type: 'label',
                        css: 'idrinth-float-half',
                        content: config.label,
                        attributes: [ {
                                name: 'for',
                                value: 'idrinth-' + config.name
                            } ]
                    }, {
                        type: 'input',
                        css: 'idrinth-float-half',
                        id: 'idrinth-' + config.name,
                        attributes: input
                    } ]
            } );
        };
        if ( config.type === '#text' ) {
            return document.createTextNode ( config.content );
        }
        if ( config.rType === '#input' ) {
            return makeInputLabel ( config );
        }
        var el = document.createElement ( config.type ? config.type : 'div' );
        setBase ( el, config );
        addChildren ( el, config );
        addAttributes ( el, config );
        return el;
    },
    controls: null,
    tooltipTO: null,
    buildModal: function ( title, content, altFunc ) {
        var mod = {
            children: [ ],
            css: 'idrinth-hovering-box idrinth-popup idrinth-' + ( typeof altFunc === 'string' ? 'confim' : 'alert' )
        };
        if ( typeof title === 'string' ) {
            mod.children.push ( {
                content: title,
                css: 'header'
            } );
        } else {
            mod.children.push ( {
                content: 'Title missing',
                css: 'header'
            } );
        }
        if ( typeof content === 'string' ) {
            mod.children.push ( {
                content: content,
                css: 'content'
            } );
        } else if ( typeof content === 'object' && content.type ) {
            mod.children.push ( {
                children: content,
                css: 'content'
            } );
        } else {
            mod.children.push ( {
                children: 'Content missing',
                css: 'content'
            } );
        }
        mod.children.push ( {
            css: 'buttons'
        } );
        var closeFunc = 'this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);';
        if ( typeof altFunc === 'string' ) {
            mod.children[mod.children.length - 1].children = [ {
                    type: 'button',
                    content: 'Ok',
                    attributes: [ {
                            name: 'onclick',
                            value: altFunc
                        } ]
                }, {
                    type: 'button',
                    content: 'Cancel',
                    attributes: [ {
                            name: 'onclick',
                            value: closeFunc
                        } ]
                } ];
        } else {
            mod.children[mod.children.length - 1].children = [ {
                    type: 'button',
                    content: 'Ok',
                    attributes: [ {
                            name: 'onclick',
                            value: closeFunc
                        } ]
                } ];
        }
        idrinth.ui.body.appendChild ( idrinth.ui.buildElement ( mod ) );
    },
    showTooltip: function ( element ) {
        'use strict';
        function tooltip ( set, element, world ) {
            if ( !set ) {
                idrinth.ui.updateClassesList ( element, [ 'idrinth-hide' ], [ ] );
                return;
            }
            var baseUrl = 'https://dotd.idrinth.de/' + ( world ? 'world-kongregate' : 'kongregate' );
            idrinth.ui.updateClassesList ( idrinth.ui.tooltip, [ ], [ 'idrinth-hide' ] );
            idrinth.ui.updateClassesList ( element, [ ], [ 'idrinth-hide' ] );
            element.childNodes[0].setAttribute ( 'href', baseUrl + '/summoner/' + set.id + '/' );
            element.childNodes[0].innerHTML = set.name;
            element.childNodes[1].childNodes[1].innerHTML = set.level + ' (' + set['7day'] + '/week, ' + set['30day'] + '/month)';
            element.childNodes[1].childNodes[3].innerHTML = idrinth.names.classes[set.class];
            element.childNodes[2].childNodes[1].setAttribute ( 'href', baseUrl + '/guild/' + set.guildId + '/' );
            element.childNodes[2].childNodes[1].innerHTML = idrinth.names.guilds[world ? 'world' : 'kongregate'][set.guildId];
            element.childNodes[3].childNodes[1].innerHTML = set.updated;
            element.childNodes[3].setAttribute ( 'style', ( new Date () ) - ( new Date ( set.updated ) ) > 86400000 ? 'color:#aa0000;' : '' );
        }
        idrinth.names.isHovering = false;
        var name = idrinth.names.parse ( element ).toLowerCase ( );
        if ( idrinth.settings.names && idrinth.ui.tooltip && idrinth.names.users[name] ) {
            window.clearTimeout ( idrinth.ui.tooltipTO );
            idrinth.ui.tooltip.setAttribute ( 'style', idrinth.ui.getElementPositioning ( element, -200, -100 ) );
            tooltip ( idrinth.names.users[name].kongregate, idrinth.ui.tooltip.firstChild, false );
            tooltip ( idrinth.names.users[name].world, idrinth.ui.tooltip.lastChild, true );
            idrinth.ui.tooltipTO = window.setTimeout ( idrinth.ui.hideTooltip, idrinth.settings.timeout ? idrinth.settings.timeout : 5000 );
        }
    },
    hideTooltip: function () {
        if ( idrinth.names.isHovering ) {
            idrinth.ui.tooltipTO = window.setTimeout ( idrinth.ui.hideTooltip, idrinth.settings.timeout ? idrinth.settings.timeout : 5000 );
            return;
        }
        idrinth.ui.updateClassesList ( idrinth.ui.tooltip, [ 'idrinth-hide' ], [ ] );
    },
    openCloseSettings: function ( ) {
        'use strict';
        var toRemove = [ ( idrinth.ui.controls.getAttribute ( 'class' ) ).match ( /(^|\s)inactive($|\s)/ ) ? 'inactive' : 'active' ];
        if ( !idrinth.settings.moveLeft ) {
            toRemove.push ( 'left-sided' );
        }
        if ( !idrinth.settings.minimalist ) {
            toRemove.push ( 'small' );
        }
        idrinth.ui.updateClassesList ( idrinth.ui.controls, [ 'active', 'inactive', 'left-sided', 'small' ], toRemove );
    },
    childOf: function ( element, cssClass ) {
        'use strict';
        do {
            if ( element.className.match ( new RegExp ( '(^|\s)' + cssClass + '(\s|$)' ) ) ) {
                return true;
            }
            if ( !element.parentNode || element === document.getElementsByTagName ( 'body' )[0] ) {
                return false;
            }
            element = element.parentNode;
        } while ( element );
        return false;
    },
    removeElement: function ( id ) {
        'use strict';
        var el = document.getElementById ( id );
        if ( el ) {
            el.parentNode.removeChild ( el );
        }
    },
    reloadGame: function ( ) {
        'use strict';
        var handleFrame = function ( parent ) {
            var frame = parent.getElementsByTagName ( 'iframe' )[0];
            frame.setAttribute ( 'src', ( frame.getAttribute ( 'src' ) ).replace ( /&ir=.*/, '' ) + '&ir=' + Math.random () );
        };
        try {
            if ( idrinth.platform === 'kongregate' ) {
                window.activateGame ( );
            } else if ( idrinth.platform === 'dawnofthedragons' ) {
                handleFrame ( document );
            } else if ( idrinth.platform === 'newgrounds' ) {
                handleFrame ( document.getElementById ( 'iframe_embed' ) );
            } else if ( idrinth.platform === 'armorgames' ) {
                handleFrame ( document.getElementById ( 'gamefilearea' ) );
            }
        } catch ( e ) {
            idrinth.core.alert ( 'The game couldn\'t be reloaded' );
        }
    },
    updateClassesList: function ( element, add, remove ) {
        var getClassesList = function ( classString, add, remove ) {
            var forceToArray = function ( value ) {
                return value && typeof value === 'object' && Array.isArray ( value ) ? value : [ ];
            };
            var original = classString === null ? [ ] : classString.split ( ' ' ).concat ( forceToArray ( add ) );
            var list = [ ];
            remove = forceToArray ( remove );
            var addUnique = function ( list, element, forbidden ) {
                if ( list.indexOf ( element ) === -1 && forbidden.indexOf ( element ) === -1 ) {
                    list.push ( element );
                }
                return list;
            };
            for (var counter = 0; counter < original.length; counter++) {
                list = addUnique ( list, original[counter], remove );
            }
            return list.join ( ' ' );
        };
        element.setAttribute ( 'class', getClassesList ( element.getAttribute ( 'class' ), add, remove ) );
    },
    activateTab: function ( name ) {
        var head = document.getElementById ( 'tab-activator-' + name ).parentNode.childNodes;
        var body = document.getElementById ( 'tab-element-' + name ).parentNode.childNodes;
        var setClasses = function ( head, body, name ) {
            if ( head === document.getElementById ( 'tab-activator-' + name ) ) {
                idrinth.ui.updateClassesList ( head, [ 'active' ], [ ] );
                idrinth.ui.updateClassesList ( body, [ ], [ 'idrinth-hide' ] );
                return;
            }
            idrinth.ui.updateClassesList ( head, [ ], [ 'active' ] );
            idrinth.ui.updateClassesList ( body, [ 'idrinth-hide' ], [ ] );
        };
        for (var count = 0; count < head.length; count++) {
            setClasses ( head[count], body[count], name );
        }
    },
    start: function ( ) {
        'use strict';
        idrinth.ui.body = document.getElementsByTagName ( 'body' )[0];
        document.getElementsByTagName ( 'head' )[0].appendChild ( idrinth.ui.buildElement ( {
            type: 'link',
            attributes: [ {
                    name: 'rel',
                    value: 'stylesheet'
                }, {
                    name: 'href',
                    value: 'https://dotd.idrinth.de###PATH###/script-styles.css?###VERSION###'
                } ]
        } ) );
    }
};