/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 * The way I want to do trees (May 08, 2007) rev. (May 14, 2007)
 * Looking and working right require proper CSS styling
 * If you find an error, or improvement, let me know: dev at ajas dot net
 *
 * The function ajas.event.cancelBubble() is found in ajas.event.js
 *****************************************************************************/
/* sample style:
ul.ajas_ui_tree {margin:0px;padding:0px;list-style:none;display:block;}
ul.ajas_ui_tree img.ajas_ui_tree_toggle   {margin:1px;padding:0;border:0;width:16px;height:16px;display:none;}
ul.ajas_ui_tree img.ajas_ui_tree_nodeIcon {margin:1px;padding:0;border:0;width:16px;height:16px;}
ul.ajas_ui_tree li.ajas_ui_tree_node {margin:0;padding:0;border:0;white-space:nowrap;}
ul.ajas_ui_tree li.ajas_ui_tree_node ul {margin:0px;padding:0 0 0 18px;list-style:none;display:block;}
ul.ajas_ui_tree li.ajas_ui_tree_node_collapse {margin:0;padding:0;border:0;white-space:nowrap;}
ul.ajas_ui_tree li.ajas_ui_tree_node_collapse ul {margin:0px;padding:0 0 0 18px;list-style:none;display:none;}
ul.ajas_ui_tree a.ajas_ui_tree_nodeLabel {padding-left:4px;color:black;background-color:transparent;text-decoration:none;}
ul.ajas_ui_tree a.ajas_ui_tree_nodeLabel:hover {text-decoration:underline;color:blue;}
ul.ajas_ui_tree a#ajas_ui_tree_activeNode {color:white;background-color:#11e;border:1px dotted yellow;}
ul.ajas_ui_tree a.ajas_ui_tree_spanDrag {border:1px solid blue;}


ul.ajas_ui_tree#menu img {display:none;}
ul.ajas_ui_tree#menu li.ajas_ui_tree_node {display:inline;position:relative;margin:0;padding:0;white-space:nowrap;}
ul.ajas_ui_tree#menu li.ajas_ui_tree_node ul {width:180px;margin:0px;list-style:none;display:block;padding:0;position:absolute;top:24px;left:0px;border:2px outset #8a8;background-color:#efe;}
ul.ajas_ui_tree#menu li.ajas_ui_tree_node_collapse {display:inline;position:relative;margin:0;padding:0;white-space:nowrap;}
ul.ajas_ui_tree#menu li.ajas_ui_tree_node_collapse ul {margin:0px;list-style:none;display:none;padding:0;position:absolute;top:24px;left:0px;border:2px outset #8a8;background-color:#efe;}
ul.ajas_ui_tree#menu li.ajas_ui_tree_node ul li {display:block;position:static;}
ul.ajas_ui_tree#menu a.ajas_ui_tree_nodeLabel {margin:0 10px;}

*/
if("undefined" == typeof(ajas))ajas={};
ajas.Tree=function(sDelim,fClick) {
    var oNewTree = document.createElement('ul');
    oNewTree.className='ajas_ui_tree';
    oNewTree.bRoot=true;
    oNewTree.oActiveNode=null;
    oNewTree.sDelim=(arguments.length < 1)?'/':sDelim;
    oNewTree.fNodeClick=(arguments.length < 2)?false:fClick;
    oNewTree.oDragNode=null;
    oNewTree.bEnableDrag=false;

    TreeNode = function(sName,aData) {
        //if(sName=='')return false;
        var oNewNode = document.createElement('li');

        //assign properties we don't mind overwritten
        oNewNode.sExpander='http://ajas.us/images/expander.gif';
        oNewNode.sCollapser='http://ajas.us/images/collapser.gif';
        oNewNode.sFolderOpen='http://ajas.us/images/folder_open.gif';
        oNewNode.sFolderClosed='http://ajas.us/images/folder_closed.gif';
        oNewNode.sLabel=sName;
        oNewNode.title=sName;
        oNewNode.className='ajas_ui_tree_node';
        
        //copy properties from passed object
        for(var i in aData) {
            oNewNode[i]=aData[i];
        }

        //assign properties we DO mind overwritten
        oNewNode.id='';
        oNewNode.sName=sName;
        oNewNode.bNode=true;
        
        oNewNode.oToggle=document.createElement('img');
        oNewNode.oToggle.className='ajas_ui_tree_toggle';
        oNewNode.oToggle.src='http://ajas.us/images/collapser.gif';
        oNewNode.appendChild(oNewNode.oToggle);
        
        oNewNode.oIcon=document.createElement('img');
        oNewNode.oIcon.className='ajas_ui_tree_nodeIcon';
        oNewNode.oIcon.src='http://ajas.us/images/folder_open.gif';
        oNewNode.appendChild(oNewNode.oIcon);
        
        oNewNode.oLabel=document.createElement('a');
        oNewNode.oLabel.className='ajas_ui_tree_nodeLabel';
        oNewNode.oLabel.innerHTML=oNewNode.sLabel;
        oNewNode.oLabel.href=oNewNode.sHREF||oNewNode.sLabel;
        oNewNode.appendChild(oNewNode.oLabel);
        
        oNewNode.oSubTree = document.createElement('ul');
        oNewNode.appendChild(oNewNode.oSubTree);

        oNewNode.setData = function(aData) {
            //copy properties from passed object
            for(var i in aData) {
                this[i]=aData[i];       
            }
    
            //assign properties we DO mind overwritten
            this.id='';
            this.sName=sName;
            this.bNode=true;
        }
        oNewNode.getPath = function() {
            o=this;
            s='';
            while (o && !o.bRoot && o.tagName!='body' && o!=document.body) {
                if (o.bNode==true) {
                    s=oNewTree.sDelim+o.sName+s;
                }
                o=o.parentNode;
            }
            return s;
        }
        
        oNewNode.toggle = function(bOpen) {
            if(arguments.length < 1) {
                bOpen=/_collapse$/.test(this.className);
            }
            if (bOpen) {
                this.className=this.className.replace(/_collapse$/,'');
                this.oToggle.src=this.sCollapser;
                this.oIcon.src=this.sFolderOpen;
            } else {
                this.className=this.className.replace(/_collapse$/,'')+'_collapse';
                this.oToggle.src=this.sExpander;
                this.oIcon.src=this.sFolderClosed;
            }
        }
        
        return oNewNode;
    };
    oNewTree.addNode = function(sPath, aData) {
        sPath=sPath.replace(new RegExp('^[^'+this.sDelim+']*'+this.sDelim+'+|'+this.sDelim+'+$','g'),'');
        if (sPath=='')return false;
        var aPath=sPath.split(this.sDelim);
        var oParentUL=this;
        
        //make sure the parent branches are ready
        for(var i=0;i<aPath.length-1;i++) {
            if(aPath[i]=='')continue;
            var oNode=false;
            for(var j in oParentUL.childNodes) {
                if (oParentUL.childNodes[j].sName == aPath[i]) {
                    oNode=oParentUL.childNodes[j];
                    break;
                }
            }
            if (!oNode) {
                oNode=new TreeNode(aPath[i],[i]);
                oParentUL.appendChild(oNode);
            }
            oParentUL=oNode.oSubTree;
        }
        
        //find specified node
        var oNode=false;
        for(var j in oParentUL.childNodes) {
            if (oParentUL.childNodes[j].sName == aPath[aPath.length-1]) {
                oNode=oParentUL.childNodes[j];
                break;
            }
        }
        if (!oNode) {
            var oNode=new TreeNode(aPath[aPath.length-1],aData);
            oParentUL.appendChild(oNode);
            return oNode; //node created
        }
        oNode.setData(aData);
        return false; //node not created, already existed
    };
    oNewTree.getNode = function(sPath) {
        sPath=sPath.replace(new RegExp('^[^'+this.sDelim+']*'+this.sDelim+'+|'+this.sDelim+'+$','g'),'');
        var aPath=sPath.split(this.sDelim);
        var oParentUL=this;
        for(var i=0;i<aPath.length;i++) {
            var oNode=false;
            for(var j in oParentUL.childNodes) {
                if (oParentUL.childNodes[j].sName == aPath[i]) {
                    oNode=oParentUL.childNodes[j];
                    break;
                }
            }
            if (!oNode) {
                return false; //not found
            }
            oParentUL=oNode.oSubTree;
        }
        return oNode; //false if not found, object if found
    };
    oNewTree.showNode = function(oNode) {
        var o=oNode;
        while (o && !o.bRoot) {
            if (o.bNode)o.toggle(true);
            o=o.parentNode;
        }
        o.scrollIntoView(false);
    };
    oNewTree.deleteNode = function(oNode) {
        oNode.parentNode.removeChild(oNode);
        oNode=null;
    };
    oNewTree.moveNode = function (oNode, oDest) {
        if (!oNode.bNode || !oDest.bNode) return false;
        if (oNode==oDest) return false;
        var o=oDest;
        while (o && !o.bRoot) {
            o=o.parentNode;
            if(oNode==o) return false;
        }
        oNode.parentNode.removeChild(oNode);
        oDest.oSubTree.appendChild(oNode);
    };
    oNewTree.setActiveNode = function(oNode,bShow) {
        if (this.oActiveNode) {
            this.oActiveNode.oLabel.id='';
        }
        if (oNode) {
            this.oActiveNode=oNode;
            this.oActiveNode.oLabel.id='ajas_ui_tree_activeNode';
            if (bShow) this.showNode(oNode);
        }
    };
    oNewTree.onselectstart = function(event) {
        ajas.event.cancelBubble(event||window.event);
    };
    oNewTree.onclick = function(event) {
        event=event||window.event;
        ajas.event.cancelBubble(event);
        var o=event.target||event.srcElement;
        if (o.className=='ajas_ui_tree_toggle') {
            o.parentNode.toggle();
        }
        if (o.className=='ajas_ui_tree_nodeIcon' || o.className=='ajas_ui_tree_nodeLabel') {
            this.setActiveNode(o.parentNode);
            if (this.fNodeClick) this.fNodeClick(this.oActiveNode);
        }
    };
    oNewTree.onmousedown = function (event) {
        event=event||window.event;
        ajas.event.cancelBubble(event);
        if (!this.bEnableDrag)return false;
        var o=event.target||event.srcElement;
        if(o.className!='ajas_ui_tree_nodeIcon' && o.className!='ajas_ui_tree_nodeLabel')return;
        this.oDragNode=o.parentNode;
    };
    oNewTree.onmouseup = function (event) {
        event=event||window.event;
        ajas.event.cancelBubble(event);
        if (!this.bEnableDrag)return false;
        var o=event.target||event.srcElement;
        while (o && !o.bNode) {
            o=o.parentNode;
        }
        if (this.oDragNode) {
            this.moveNode(this.oDragNode,o);
            this.oDragNode.oLabel.style.top=0;
            this.oDragNode.oLabel.style.left=0;
            this.oDragNode.oLabel.style.position='';
            this.oDragNode.oLabel.className='ajas_ui_tree_nodeLabel';
        }
        this.oDragNode=null;
    };
    oNewTree.onmousemove = function (event) {
        event=event||window.event;
        ajas.event.cancelBubble(event);
        if (!this.bEnableDrag)return false;
    
        if (this.oDragNode) {
            var mc=ajas.event.mouseCoords(event);
            this.oDragNode.oLabel.style.position='absolute';
            this.oDragNode.oLabel.style.top=(mc.y );
            this.oDragNode.oLabel.style.left=(mc.x+12);
            this.oDragNode.oLabel.className='ajas_ui_tree_spanDrag';
        }
    };
    return oNewTree;
};
