idrinth.tier = {
    list: { },
    addTagged: function ( name ) {
        if ( !name || !this.list.hasOwnProperty ( name ) || typeof this.list[name] === 'function' || document.getElementById ( 'idrinth-tier-box-' + name ) ) {
            return;
        }
        var space = window.innerWidth - 150 * ( document.getElementsByClassName ( 'idrinth-tier-box' ).length + 2 );
        if ( space < 150 ) {
            return idrinth.alert ( 'There is no space for another tier-box at the moment, please close one first.' );
        }
        var info = [
            {
                content: 'FS ' + idrinth.ui.formatNumber ( this.list[name].fs.nm )
            },
            {
                content: 'AP ' + idrinth.ui.formatNumber ( this.list[name].ap )
            } ];
        if ( this.list[name].os && this.list[name].os.nm ) {
            info.push ( {
                content: 'OS ' + idrinth.ui.formatNumber ( this.list[name].os.nm )
            } );
            info.unshift ( {
                content: 'MaT ' + idrinth.ui.formatNumber ( this.list[name].nm[this.list[name].nm.length - 1] )
            } );
            info.unshift ( {
                content: 'MiT ' + idrinth.ui.formatNumber ( this.list[name].nm[0] )
            } );
        }
        info.unshift (
                {
                    type: 'strong',
                    content: this.list[name].name.replace ( /\(.*$/, '' )
                } );
        idrinth.ui.body.appendChild ( idrinth.ui.buildElement (
                {
                    id: 'idrinth-tier-box-' + name,
                    css: 'idrinth-hovering-box idrinth-tier-box',
                    children: [ {
                            children: info
                        } ],
                    attributes: [
                        {
                            name: 'title',
                            value: 'click to close'
                        },
                        {
                            name: 'onclick',
                            value: 'idrinth.ui.removeElement(this.id);'
                        },
                        {
                            name: 'style',
                            value: 'left:' + space + 'px;background-image: url(https://dotd.idrinth.de/static/raid-image-service/' + this.list[name].url + '/);'
                        }
                    ]
                }
        ) );
    },
    start: function () {
        'use strict';
        idrinth.runAjax (
                'https://dotd.idrinth.de/' + idrinth.platform + '/tier-service/',
                function ( text ) {
                    idrinth.tier.import ( text );
                },
                function ( ) {
                    window.setTimeout ( idrinth.tier.start, 10000 );
                },
                function ( ) {
                    window.setTimeout ( idrinth.tier.start, 10000 );
                }
        );
    },
    import: function ( data ) {
        'use strict';
        data = JSON.parse ( data );
        if ( data ) {
            idrinth.tier.list = data;
        } else {
            window.setTimeout ( idrinth.tier.start, 1000 );
        }
    },
    getTierForName: function ( name ) {
        var clearInnerHtml = function clearInnerHtmlF ( elem ) {
            elem.innerHTML = '';
        };

        var makeList = function ( list ) {
            var makeField = function ( listKey, difficulty, ic ) {
                var ln = {
                    type: 'td'
                };
                try {
                    ln.styles = idrinth.tier.list[listKey].os[difficulty] === idrinth.tier[listKey][difficulty][ic] ? 'is-os' : '';
                } catch ( E ) {
                    idrinth.log ( E.toString ( ) );
                }
                try {
                    ln.content = idrinth.ui.formatNumber ( idrinth.tier.list[listKey][difficulty][ic] ) + ' ' +
                            idrinth.tier.list[listKey].epics[difficulty][ic] + 'E';
                } catch ( E2 ) {
                    idrinth.log ( E2.toString ( ) );
                    try {
                        ln.content = idrinth.ui.formatNumber ( idrinth.tier.list[listKey][difficulty][ic] );
                    } catch ( E3 ) {
                        idrinth.log ( E3.toString ( ) );
                    }
                }
                return ln;
            };
            var makeRow = function ( title, dataset ) {
                return {
                    type: 'tr',
                    children: [
                        {
                            type: 'th',
                            content: title
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.n )
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.h )
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.l )
                        },
                        {
                            type: 'td',
                            content: idrinth.ui.formatNumber ( dataset.nm )
                        }
                    ]
                };
            };
            var wrapper = document.getElementById ( 'idrinth-tierlist' );
            clearInnerHtml ( wrapper );
            for (var count = list.length - 1; count >= 0; count--) {
                var sub = idrinth.ui.buildElement ( {
                    css: 'tier-wrapper',
                    children: [
                        {
                            type: 'img',
                            attributes: [ {
                                    name: 'src',
                                    value: 'https://dotd.idrinth.de/static/raid-image-service/' + idrinth.tier.list[list[count]].url + '/'
                                } ]
                        },
                        {
                            type: 'strong',
                            content: idrinth.tier.list[list[count]].name
                        },
                        {
                            type: 'button',
                            content: 'Tag to screen-top',
                            attributes: [
                                {
                                    name: 'onclick',
                                    value: 'idrinth.tier.addTagged(\'' + list[count] + '\');'
                                },
                                {
                                    name: 'type',
                                    value: 'action'
                                }
                            ]
                        },
                        {
                            type: 'span',
                            content: 'AP: ' + idrinth.ui.formatNumber ( idrinth.tier.list[list[count]].ap )
                        },
                        {
                            type: 'table',
                            children: [
                                {
                                    type: 'thead',
                                    children: [
                                        {
                                            type: 'tr',
                                            children: [
                                                {
                                                    type: 'th',
                                                    content: '#'
                                                },
                                                {
                                                    type: 'th',
                                                    content: 'Normal'
                                                },
                                                {
                                                    type: 'th',
                                                    content: 'Hard'
                                                },
                                                {
                                                    type: 'th',
                                                    content: 'Legend'
                                                },
                                                {
                                                    type: 'th',
                                                    content: 'Nightmare'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'tbody',
                                    children: [
                                        makeRow ( 'FS', idrinth.tier.list[list[count]].fs ),
                                        makeRow ( 'OS', idrinth.tier.list[list[count]].os ),
                                        makeRow ( '', {
                                            n: '',
                                            l: '',
                                            h: '',
                                            nm: ''
                                        } )
                                    ]
                                }
                            ]
                        }
                    ]
                } );
                var maxTiers = Math.max ( idrinth.tier.list[list[count]].n.length, idrinth.tier.list[list[count]].h.length, idrinth.tier.list[list[count]].l.length, idrinth.tier.list[list[count]].nm.length );
                for (var ic = 0; ic < maxTiers; ic++) {
                    sub.lastChild.lastChild.appendChild ( idrinth.ui.buildElement ( {
                        type: 'tr',
                        children: [
                            {
                                type: 'th',
                                content: ic + 1
                            },
                            makeField ( list[count], 'n', ic ),
                            makeField ( list[count], 'h', ic ),
                            makeField ( list[count], 'l', ic ),
                            makeField ( list[count], 'nm', ic )
                        ]
                    } ) );
                }
                wrapper.appendChild ( sub );
            }
        };
        if ( !name || name.length === 0 ) {
            clearInnerHtml ( document.getElementById ( 'idrinth-tierlist' ) );
            return;
        }
        var result = [ ];
        var regExp = new RegExp ( name, 'i' );
        for (var key in idrinth.tier.list) {
            if ( key.match ( regExp ) ) {
                result.push ( key );
            }
        }
        makeList ( result );
    }
};