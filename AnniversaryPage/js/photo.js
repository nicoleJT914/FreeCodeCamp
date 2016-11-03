/**
 * Created by saio on 16/10/23.
 */
;( function (window) {

    'use strict';

    function shuffleMArray( marray ) {
        var arr=[], marrlen = marray.length, inArrLen = marray[0].length;
        for (var i=0; i<marrlen; i++) {
            arr = arr.concat( marray[i] );
        }
        // shuffle 2d array
        arr = shuffleArr( arr );
        //to 2d
        var newmarr = [], pos=0;
        for (var j=0;j<marrlen;j++) {
            var tmparr = [];
            for( var k=0; k<inArrLen;k++) {
                tmparr.push( arr[pos]);
                pos++
            }
            newmarr.push( tmparr );
        }
        return newmarr;
    }

    function shuffleArr( array ) {
        var m = array.length, t, i;
        //while there remain elements to shuffle...
        while (m) {
           // Pick a remaining element
            i = Math.floor(Math.random()*m--);
            // and swap it with the current element
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    function Photostack(el) {
        this.el = el;
        this.inner = this.el.querySelector('div');
        // get all 'figure' eles
        this.items = [].slice.call(this.inner.querySelectorAll('figure'));
        this.itemsCount = this.items.length;
        if (!this.itemsCount) return;
        // current idx
        this.current = 0;
        this._init();
    }

    //初始化，取当前海报，添加导航条，获取当前海报位置信息，。。。
    Photostack.prototype._init = function () {
        // current ele
        this.currentItem = this.items[ this.current ];
        this._addNavigation();
        this._getSizes();
        this._initEvents();
    };

    //生成导航条
    Photostack.prototype._addNavigation = function () {
        this.nav = document.createElement( 'nav' );
        var inner = '';
        for (var i=0; i < this.itemsCount; ++i) {
            inner += '<span></span>';
        }
        this.nav.innerHTML = inner;
        this.el.appendChild(this.nav);
        this.navDots = [].slice.call( this.nav.children );
    };

    //计算中心海报的位置信息
    Photostack.prototype._getSizes = function () {
        this.sizes = {
            inner: {
                width: this.inner.offsetWidth,
                height: this.inner.offsetHeight
            },
            item: {
                width: this.currentItem.offsetWidth,
                height: this.currentItem.offsetHeight
            }
        };
        this.centerItem = {
            x: this.sizes.inner.width/2 - this.sizes.item.width/2,
            y: this.sizes.inner.height/2 - this.sizes.item.height/2
        };
    };
    //
    Photostack.prototype._initEvents = function () {
        var self = this;

        //self.openDefault = true;
        self._showPhoto( self.current );
        // click the navDots
        this.navDots.forEach( function (dot, idx) {
            dot.addEventListener( 'click', function () {
                // rotate the photo if clicking on the current photo
                if( idx == self.current ) {
                    self._rotateItem();
                }
                else {
                    // if the photo is flipped then rotate it back before shuffling again
                    var callback = function () { self._showPhoto( idx ); };
                    if( self.flipped ) {
                        self._rotateItem( callback );
                    }
                    else {
                        callback();
                    }

                }
            })
        });

        this.items.forEach( function (item, idex) {
            item.addEventListener('click', function () {
                if (idex == self.current) {
                    self._rotateItem();
                }
            })
        })        
    };

    Photostack.prototype._rotateItem = function (callback) {

        if (!this.isRotating) {
            // rotate animation is playing
            this.isRotating = true;

            // to show the front
            if (this.flipped) {
                classie.removeClass( this.navDots[ this.current ], 'flip');
                this.currentItem.style.WebkitTransform = 'translate('+this.centerItem.x+'px,'+this.centerItem.y+'px) rotateY(0deg)';
                this.currentItem.style.transform = 'translate('+this.centerItem.x+'px,'+this.centerItem.y+'px) rotateY(0deg)';
            }
            // to show the back
            else {
                classie.addClass( this.navDots[ this.current ], 'flip');
                // firstly move to center, then rotate
                this.currentItem.style.WebkitTransform = 'translate('+this.centerItem.x+'px,'+this.centerItem.y+'px) translate('+this.sizes.item.width+'px) rotateY(-179.9deg)';
                this.currentItem.style.transform = 'translate('+this.centerItem.x+'px,'+this.centerItem.y+'px) translate('+this.sizes.item.width+'px) rotateY(-179.9deg)';
            }

            this.flipped = !this.flipped;
            this.isRotating  = false;
            if (typeof callback == 'function') { callback(); }
        }
    };

    Photostack.prototype._showPhoto = function ( pos ) {
        if ( this.isShuffling ) {
            return false;
        }
        // start shuffling
        this.isShuffling = true;

        classie.removeClass( this.navDots[ this.current ], 'current');
        classie.removeClass( this.currentItem, 'photo-current' );

        //change current
        this.current = pos;
        this.currentItem = this.items[ this.current ];
        classie.addClass( this.currentItem, 'photo-current');
        classie.addClass( this.navDots[ this.current ], 'current' );

        this._shuffle();
    };

    // display items(randomly)
    Photostack.prototype._shuffle = function () {
        var overlapFactor = .5,
            // lines & columns
            lines = Math.ceil(this.sizes.inner.width / (this.sizes.item.width * overlapFactor)),
            columns = Math.ceil(this.sizes.inner.height / (this.sizes.item.height * overlapFactor)),
            // since we are rounding up the previous calcs we need to know how much more we are adding to the calcs for both x and y axis
            addX = lines * this.sizes.item.width * overlapFactor + this.sizes.item.width/2 - this.sizes.inner.width,
            addY = columns * this.sizes.item.height * overlapFactor + this.sizes.item.height/2 - this.sizes.inner.height,
            // we will want to center the grid
            extraX = addX/2,
            extraY = addY/2,
            // max and min rotation angles
            maxrot = 35, minrot = -35,
            self = this,
            // translate/rotate items
            moveItems = function () {
                var grid = [];
                // populate the positions grid
                for( var i=0; i<columns; ++i) {
                    var col = grid[i] = [];
                    for (var j=0; j<lines; ++j) {
                        var xVal = j * (self.sizes.item.width * overlapFactor) - extraX,
                            yVal = i * (self.sizes.item.height * overlapFactor) - extraY,
                            olx = 0, oly = 0;

                        var ol = self._isOverlapping({x:xVal,y:yVal});
                        if (ol.overlapping) {
                            olx = ol.noOverlap.x;
                            oly = ol.noOverlap.y;
                            var r = Math.floor(Math.random()*3);
                            switch (r) {
                                case 0: olx = 0;break;
                                case 1: oly = 0;break;
                            }
                        }
                        col[j] = { x:xVal+olx, y:yVal+oly };
                    }
                }
                grid = shuffleMArray(grid);

                var l=0,c=0;
                self.items.forEach(function (item, i) {
                    //pick a random item from the grid
                    if (l===lines-1){
                        c = c==columns-1?0:c+1;
                        l=1;
                    }
                    else {
                        ++l;
                    }
                    var gridVal = grid[c][l-1],
                        transition = {x:gridVal.x, y:gridVal.y};
                    if (i === self.current) {
                        // change transform-origin
                        self.currentItem.style.WebkitTransform = 'translate(' + self.centerItem.x + 'px,' + self.centerItem.y + 'px) rotate(0deg)';
                        self.currentItem.style.transform = 'translate(' + self.centerItem.x + 'px,' + self.centerItem.y + 'px) rotate(0deg)';
                    }
                    else {
                        item.style.WebkitTransform = 'translate(' + transition.x + 'px,' + transition.y + 'px) rotate(' + Math.floor( Math.random()*(maxrot-minrot+1)+minrot) +'deg)';
                        item.style.transform = 'translate(' + transition.x + 'px,' + transition.y + 'px) rotate(' + Math.floor( Math.random()*(maxrot-minrot+1)+minrot) +'deg)';
                    }
                });
            };
            moveItems.call();
            self.isShuffling = false;
    };

    Photostack.prototype._isOverlapping = function ( itemVal ) {
        var dxArea = this.sizes.item.width + this.sizes.item.width/3,   //adding some extra avoids any rotated item to touch the central area
            dyArea = this.sizes.item.height + this.sizes.item.height/3,
            areaVal = { x:this.sizes.inner.width/2-dxArea/2, y:this.sizes.inner.height/2-dyArea/2},
            dxItem = this.sizes.item.width,
            dyItem = this.sizes.item.height;

        if (!((itemVal.x+dxItem)<areaVal.x || itemVal.x>( areaVal.x+dxArea) || (itemVal.y+dyItem)<areaVal.y || itemVal.y>( areaVal.y+dyArea))) {
            //how much to move so it does not overlap? move left/ or move right
            var left = Math.random() < 0.5,
                randExtraX = Math.floor( Math.random()*(dxItem/4+1) ),
                randExtraY = Math.floor( Math.random()*(dyItem/4+1) ),
                noOverlapX = left ? (itemVal.x - areaVal.x + dxItem) * -1 - randExtraX : (areaVal.x + dxArea) - (itemVal.x + dxItem) + dxItem + randExtraX,
                noOverlapY = left ? (itemVal.y - areaVal.y + dyItem) * -1 - randExtraY : (areaVal.y + dyArea) - (itemVal.y + dyItem) + dyItem + randExtraY;
            return {
                overlapping:true,
                noOverlap: { x:noOverlapX, y:noOverlapY }
            }
        }
        return {
            overlapping:false
        }
    };
    window.Photostack = Photostack;
})(window);
