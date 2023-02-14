var editor = document.getElementById("editor");
var saving_data;
var saving_timer;


$('#editor').focusout(function(e){
    //e.preventDefault();
    //editor.focus();
});

$('#editor').mousedown(function(e){
    //$(this).text('');

});


function initDoc(){
    if($('#editor').children().length === 0){
        $('#editor').html('<div class="page"><div class="page_content"><p class="scenenumber" contenteditable="false">1</p><p class="content_p sceneheading"><span class="sceneheading-content"><br></span></p></div></div>');
    }else if(editor.children.length == 1 && editor.childNodes[0].nodeName == 'BR'){
        $('#editor').html('<div class="page"><div class="page_content"><p class="scenenumber" contenteditable="false">1</p><p class="content_p sceneheading"><span class="sceneheading-content"><br></span></p></div></div>');
    }
    //$('#editor').get(0).focus();
    
    //////////////console.log($('#editor').children('.page').eq(0).children('.page_content').children(0).get(0));

    setTimeout(function() {
        editor.focus();
        setCharacterMargin();
    }, 0);
    
    

    
    
    setCharacterMargin();
    
    setScenenumber();
    setTimeout(function(){
        if($('#editor').children('.page').eq(0).children('.page_content').children(0).get(0).classList.contains('scenenumber') === true){
            setCaret($('#editor').children('.page').eq(0).children('.page_content').children(0).get(1), 0);
        }else{
            setCaret($('#editor').children('.page').eq(0).children('.page_content').children(0).get(0), 0);
        }

        console.log("hjgs",$('#editor').children('.page').eq(0).children('.page_content').children(0).get(1))
        checkSelectionOptions();
    }, 12);
    if(title_val === false){
        setTimeout(setTitleMargin, 15);
        //setTimeout(action, 20);
        //setTitleMargin();
    }
    resizePages(1.25);
    setTimeout(function(){
        setPageno();
        resizePages(1.25);
        $(document).ready(function(){
            setTimeout(function(){
                resizePages(1.25);
            }, 100);
        });
        
    }, 100);
}

function formatDoc(sCmd, sValue) {
    document.execCommand(sCmd, false, sValue);
    selectionIsBold();
    selectionIsItalic();
    selectionIsUnderline();
    editor.focus();
}

function selectionIsBold() {
    var isBold = false;
    if (document.queryCommandState) {
        isBold = document.queryCommandState("bold");
    }
    if(isBold === true){
        $('#boldBtn').addClass('active');
    }else{
        $('#boldBtn').removeClass('active');
    }
}

function selectionIsItalic() {
    var isItalic = false;
    if (document.queryCommandState) {
        isItalic = document.queryCommandState("italic");
    }
    if(isItalic === true){
        $('#italicBtn').addClass('active');
    }else{
        $('#italicBtn').removeClass('active');
    }
}

function selectionIsUnderline() {
    var isUnderline = false;
    if (document.queryCommandState) {
        isUnderline = document.queryCommandState("underline");
    }
    if(isUnderline === true){
        $('#underlineBtn').addClass('active');
    }else{
        $('#underlineBtn').removeClass('active');
    }
}

function saveSelection() {
    if (window.getSelection) {
        sel = window.getSelection();

        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && range.select) {
            range.select();
        }
    }
}

$('body').click(function(){
    //editor.focus();
    /*setTimeout(function(){
        //////////console.log(saveSelection());
        //saveSelection();
        //restoreSelection();
    }, 20);*/
});


const getChildrenHeight = function(element) {
  total = 0;
  last = null;
  if (element.childNodes) {
    for (let child of element.childNodes) {
      switch (child.nodeType) {
        case Node.ELEMENT_NODE:
            
            
            if(child.classList.contains('scenenumber') === false){
                //total += child.offsetHeight;
            }
            //////console.log(child.classList);
            if(child.classList.contains('dialogue') && last !== null && last.classList.contains('character')){
                total += child.offsetHeight;
            }else if(child.classList.contains('general') && last !== null && last.classList.contains('character')){
                total += child.offsetHeight;
            }else if(child.classList.contains('dialogue') && last !== null && last.classList.contains('general')){
                total += child.offsetHeight;
            }else if(child.classList.contains('scenenumber') === false){
                total += (child.offsetHeight + 17);
            }
            
          last = child;
          break;
        case Node.TEXT_NODE:
          let range = document.createRange();
          range.selectNodeContents(child);
          rect = range.getBoundingClientRect();
          total += (rect.bottom - rect.top);
          break;
      }
    }
  }
  //////console.log("TOTAL: " + total);
  return total;
};


function setCaret(el, offset) {
    var range = document.createRange();
    var sel = window.getSelection();
      if(sel && sel.rangeCount > 0){
        if(range.setStart(el, offset)){
        ////////////////////////console.log("NOPE");
        }
        
     }// else{
	// console.log('sel not exist')	
	// }
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
    //editor.focus();
};

//el.childNodes[1].childNodes[0].childNodes[0].childNodes[0]
function wrapText(text, maxLen) {
    
    alert('Hewllo');
    var count = text.split('\n');
    var rows = [];
    if(count.length > 1){
        for (let index = 0; index < count.length; index++) {
            if(count[index].length > maxLen){
                var count2 = count[index].length / maxLen;
                for (let index2 = 0; index2 < count2; index2++) {
                    if(index2 == 0){
                        rows.push(count[index].substr(0, maxLen));
                    }else{
                        rows.push(count[index].substr((maxLen * index2), maxLen));
                    }
                }
            }else{
                rows.push(count[index]);
            }
        }
    }else{
        var count = text.length / maxLen;
        for (let index = 0; index < count; index++) {
            if(index == 0){
                rows.push(text.substr(0, maxLen));
            }else{
                rows.push(text.substr((maxLen * index), maxLen));
            }
        }
    }
    return rows;
}

function randomString(strLength, charSet){
    var result = [];

    strLength = strLength || 5;
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    while (strLength--) {
        result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }

    return result.join('');
}


function getStyle(el,styleProp)
{
    var x = el;
    if (x.currentStyle)
        var y = x.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
    return y;
}

function calculateLineHeight (element) {

  var lineHeight = parseInt(getStyle(element, 'line-height'), 10);
  //////console.log(getStyle(element, 'line-height'));
  //////console.log(lineHeight);
  var clone;
  var singleLineHeight;
  var doubleLineHeight;

  if (isNaN(lineHeight)) {
    clone = element.cloneNode();
    //////console.log(clone);
    clone.innerHTML = '<br>';
    element.appendChild(clone);
    singleLineHeight = clone.offsetHeight;
    clone.innerHTML = '<br><br>';
    doubleLineHeight = clone.offsetHeight;
    element.removeChild(clone);
    lineHeight = doubleLineHeight - singleLineHeight;
  }

  return lineHeight;
}

function getNumlines(el){return Math.ceil(el.offsetHeight / calculateLineHeight (el))}


$('.page').click(function(){
    selectionIsBold();
    selectionIsItalic();
    selectionIsUnderline();
    checkSelectionOptions();
});


var maxHeight = 946;
var maxWidth = 586;
var lineHeight = 20;

editor.addEventListener('keyup', function(e){
    if(e.keyCode == 8){
        if(editor.children.length == 1 && editor.childNodes[0].nodeName == 'BR'){
            //////////////////console.log("ALL");
            //initDoc();
        }
    }
    selectionIsBold();
    selectionIsItalic();
    selectionIsUnderline();
    checkSelectionOptions();
    
});

editor.addEventListener('keydown', function(e){
    localStorage.setItem('prev_last_child_length', 0);
    //////////////////////console.log('KEYDOWN');
    
    let last_offset = getSelection().anchorOffset;
    let second_last_offset = getSelection().focusOffset;
    let selection_collapsed = getSelection().isCollapsed;
    let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
        
    
        if(selection == null){
            selection = getSelection().anchorNode;
        }
    // }
    ////////////////////////console.log(selection);
    ////////////////////////console.log(last_offset);
    if(e.keyCode === 13 && !e.shiftKey){
        ////////////////////console.log('textContent:');
        ////////////////////console.log(selection.textContent);
        if(selection.textContent == ''){
            ////////////console.log('CLASS');
            ////////////console.log(selection.classList);
            if(selection.classList.contains('sceneheading')){
                //selection.previousSibling.remove();
                action();
                e.preventDefault();
            }else if(selection.classList.contains('action')){
                sceneheading();
                e.preventDefault();
            }else{
                action();
                e.preventDefault();
            }
        }else{
            ////////////////////console.log(getSelection());
            if(selection.classList.contains('character')){
                var text = selection.textContent;
                ////////////////////console.log(text);
                if(selection_collapsed == true){
                    text = text.substr(last_offset, text.length);
                }
                ////////////////////console.log(text);
    
                if(text == ''){
                    var p = document.createElement('p');
                    p.classList.add('content_p');
                    p.classList.add('dialogue');

                    var span = document.createElement('span');
                    span.classList.add('dialogue-content');
                    span.innerHTML = '<br>';
                    p.appendChild(span);

                    if(lang == 1){
                        $('#options_selection').children('span').html('Dialogue');
                    }else if(lang == 2){
                        $('#options_selection').children('span').html('حوار');
                    }

                    selection.parentNode.insertBefore(p, selection.nextSibling);

                    setDialoguenumber();

                    setCaret(p.childNodes[0].childNodes[0], 0);
                    editor.dispatchEvent(new Event('input', {bubbles:true}));

                    e.preventDefault();
                }
                

                //setTimeout(action, 10);
                //e.preventDefault();
            }else if(selection.classList.contains('dialogue')){
                var text = selection.textContent;
                ////////////////////console.log(text);
                if(selection_collapsed == true){
                    text = text.substr(last_offset, text.length);
                }
                ////////////////////console.log(text);
    
                if(text == ''){
                    var p = document.createElement('p');
                    p.classList.add('content_p');
                    p.classList.add('character');
                    p.innerHTML = '<br>';

                    if(lang == 1){
                        $('#options_selection').children('span').html('Character');
                    }else if(lang == 2){
                        $('#options_selection').children('span').html('شخصية');
                    }

                    selection.parentNode.insertBefore(p, selection.nextSibling);

                    setCaret(p.childNodes[0], 0);
                    editor.dispatchEvent(new Event('input', {bubbles:true}));

                    e.preventDefault();
                }
            }

            ////////////console.log('selection: ');
            ////////////console.log(selection);

            if(selection.classList.contains('sceneheading')){
                var text = selection.textContent;
                ////////////////////console.log(text);
                if(selection_collapsed == true){
                    text = text.substr(last_offset, text.length);
                }
                ////////////////////console.log(text);
    
                if(text == ''){
                    var p = document.createElement('p');
                    p.classList.add('content_p');
                    p.classList.add('action');

                    p.innerHTML = '<br>';

                    if(lang == 1){
                        $('#options_selection').children('span').html('Action');
                    }else if(lang == 2){
                        $('#options_selection').children('span').html('حد');
                    }
                    selection.parentNode.insertBefore(p, selection.nextSibling);

                    //setDialoguenumber();

                    setCaret(p.childNodes[0], 0);
                    editor.dispatchEvent(new Event('input', {bubbles:true}));

                    e.preventDefault();
                }
                

                //setTimeout(action, 10);
                //e.preventDefault();
            }

            if(selection.classList.contains('action')){
                var text = selection.textContent;
                ////////////////////console.log(text);
                if(selection_collapsed == true){
                    text = text.substr(last_offset, text.length);
                }
                ////////////////////console.log(text);
    
                if(text == ''){
                    var p = document.createElement('p');
                    p.classList.add('content_p');
                    p.classList.add('character');
                    p.innerHTML = '<br>';

                    if(lang == 1){
                        $('#options_selection').children('span').html('Character');
                    }else if(lang == 2){
                        $('#options_selection').children('span').html('شخصية');
                    }

                    selection.parentNode.insertBefore(p, selection.nextSibling);

                    setCaret(p.childNodes[0], 0);
                    editor.dispatchEvent(new Event('input', {bubbles:true}));

                    e.preventDefault();
                }
                

                //setTimeout(action, 10);
                //e.preventDefault();
            }
        }
        
        
        //////////////////////console.log('ENTER');
        $('.' + selection.getAttribute('data-class')).removeClass(selection.getAttribute('data-class'));
        selection.removeAttribute('data-class');
        ////////////////////////console.log(selection);
    }

    if(e.keyCode == 8){
        //e.preventDefault();
        var selection_all = getSelection();
        //////console.log(selection);
        if(selection_all.anchorOffset == 0){
            
            if(selection.classList.contains('sceneheading') || selection.classList.contains('dialogue')){
                console.log('SN');
                var current_text_html = selection.childNodes[0].innerHTML;
                if(selection.classList.contains('sceneheading')){
                    var previous_sibling = selection.previousSibling.previousSibling;
                }else{
                    var previous_sibling = selection.previousSibling;
                }

                console.log(previous_sibling);
                
                
            }else{
                console.log('SN2');
                var current_text_html = selection.innerHTML
                var previous_sibling = selection.previousSibling;
            }
            if(current_text_html != '<br>' && second_last_offset == 0){
                e.preventDefault();
                console.log(second_last_offset);
                

                var pageno = selection.parentNode.parentNode.getAttribute('pageno');
                var page = $(selection.parentNode.parentNode);
                var index = page.children().eq(0).index($(selection));
                ////console.log($(selection));
                ////console.log(page);
                ////console.log(page.children().eq(0));
                ////console.log('index', index);
                //if(pageno > 1 && )
                ////console.log(previous_sibling);
                if(previous_sibling){
                    var previous_sibling_length = previous_sibling.textContent.length;

                    if(previous_sibling.classList.contains('sceneheading') || previous_sibling.classList.contains('dialogue')){
                        previous_sibling.childNodes[0].innerHTML += (current_text_html).trim();

                        if(previous_sibling.childNodes[0].childNodes[0]){
                            setCaret(previous_sibling.childNodes[0].childNodes[0], previous_sibling_length);
                        }else if(previous_sibling.childNodes[0]){
                            setCaret(previous_sibling.childNodes[0], previous_sibling_length);
                        }
                        
                        selection.remove();
                    }else{
                        previous_sibling.innerHTML += (current_text_html).trim();
			selection.remove();
                        setCaret(previous_sibling.childNodes[0], previous_sibling_length);
                    }
                }else{
                    //// console.log('SN LAST');
                    var prev_page = $(page).prev();
                    var prev_last_child = $(prev_page).children().eq(0).children().last();
                    var prev_last_child_length = (prev_last_child.get(0).textContent).length;
                    ////console.log(prev_last_child_length);
                    var first_child = page.children().eq(0).children().eq(0).get(0);
                    ////console.log(prev_page);
                    ////console.log(prev_last_child);
                    ////console.log(first_child);
			//if(getSelection().getRangeAt(0).startContainer.textContent.length == 0){
			//	getSelection().getRangeAt(0).startContainer.remove();	
			//}
                    

                    if(prev_last_child.get(0).classList.contains('sceneheading') || prev_last_child.get(0).classList.contains('dialogue')){
                        prev_last_child.get(0).childNodes[0].innerHTML += (current_text_html).trim();

                        setCaret(prev_last_child.get(0).childNodes[0].childNodes[0], prev_last_child_length);
                        selection.remove();
                    }else{
                        prev_last_child.get(0).innerHTML += (current_text_html).trim();
			selection.remove();
                        setCaret(prev_last_child.get(0).childNodes[0], prev_last_child_length);
                        
                    }
                    localStorage.setItem('prev_last_child_length', prev_last_child_length);
                    //console.log(selection);
                    //console.log(first_child);
                    if(selection == first_child && $(page).children().eq(0).children().eq(0).text() == '' && $(page).children().eq(0).children().length == 1){
                        //$(page).remove();
                    }
                }

                editor.dispatchEvent(new Event('input', {bubbles:true}));

                setPageno();
                setScenenumber();

                if(saving_timer != undefined){
                    clearTimeout(saving_timer);
                }
                saving_timer = setTimeout(function(){
                    saveProjects(project_id);
                }, 1000);


                
                
                
            }
            //////console.log(current_text_html);
            //////console.log(previous_sibling);

        }



        ////////console.log(selection_all);
        ////////console.log(selection_all.focusNode);
        ////////console.log(selection_all.focusNode.nodeName);
        //////////////////console.log(getSelection().anchorNode);
        //$('#editor').children().first().children('.page_content').children().first().text();
        if(selection_all.isCollapsed == false && selection_all.anchorOffset == 0 && selection_all.anchorNode.textContent == $('#editor').children().first().children('.page_content').children().first().text()){
            ////////console.log('FIRST');
            if(selection_all.isCollapsed == false && selection_all.focusOffset == $('#editor').children().last().children('.page_content').children().last().text().length && selection_all.focusNode.textContent == $('#editor').children().last().children('.page_content').children().last().text()){
                //////////console.log("HMMMMMMMMMM");
                $('#editor').children().not(':first').remove();
                $('#editor').children().first().children().first().children().not(':first').remove();
                $('#editor').children().first().children().first().children().first().html('<br>');

                //$('#editor').html('<div class="page"><div class="page_content"><p class="content_p action"><br></p></div></div>');
                e.preventDefault();
                setTimeout(function(){
                    editor.focus();
                }, 10);
            }
        }
        //$('#editor').children().last().children('.page_content').children().last().text();


        if(selection_all.anchorNode.nodeName == 'DIV'){
            //////////console.log(selection_all);
            if(selection_all.anchorNode.classList.contains('page_wrapper')){
                //$('#editor').html('<div class="page"><div class="page_content"><p class="content_p"><br></p></div></div>');
                setTimeout(function(){
                    //editor.focus();
                }, 1000);
                e.preventDefault();
            }
        }
        

        if($('.page').length == 1 && $('.page').children('.page_content').children('p').length == 2 && $('.page').children('.page_content').children('p').eq(0).hasClass('scenenumber') == true){
            //////console.log("GOT IT");
            if($('.page').children('.page_content').children('p').eq(1).children('span').html() == '<br>'){
                editor.dispatchEvent(new Event('input', {bubbles:true}));
                e.preventDefault();
            }
        }

        if($('.page').length == 1 && $('.page').children('.page_content').children('p').length == 1){
            if($('.page').children('.page_content').children('p').html() == '<br>'){
                editor.dispatchEvent(new Event('input', {bubbles:true}));
                e.preventDefault();
            }else if($('.page').children('.page_content').children('p').eq(0).children('span').html() == '<br>'){
                editor.dispatchEvent(new Event('input', {bubbles:true}));
                e.preventDefault();
            }
        }

        if(last_offset == 0){
            ////////////////////////console.log(selection.getAttribute('data-class'));
            if(selection.getAttribute('data-class') != null && selection.getAttribute('data-class') != ''){
                var first_element = selection;
                var second_element = document.getElementsByClassName(selection.getAttribute('data-class'))[0];
                if(second_element){
                    first_element.textContent = first_element.textContent + second_element.textContent;
                    var parent_element = second_element.parentNode;
                    
                    if(parent_element.childNodes.length == 1){
                        parent_element.parentNode.remove();
                    }else{
                        second_element.remove();
                    }
                    //editor.dispatchEvent(new Event('input', {bubbles:true}));
                }
            }
        }


        /*var currentPage = selection.parentNode.parentNode;
        var firstItem = currentPage.childNodes[0].childNodes[0];
        var pageno = currentPage.getAttribute('pageno');
        if(pageno > 1 && last_offset == 0 && selection == firstItem){
            
            e.preventDefault();
            //////////console.log(pageno);
            //////////console.log((Number(pageno) - 2));
            var last_previous = $('.page').eq((Number(pageno) - 2)).children('.page_content').eq(0).children().last();
            
            ////////console.log(last_previous.text().length);
            ////////console.log("HMMMMMMMMM");
            setCaret(last_previous.get(0).childNodes[0], last_previous.text().length);
        }*/
        //////////console.log(currentPage);
    }

    setCharacterMargin();
    setScenenumber();
    setPageno();
});

editor.addEventListener('input', function(e) {
    ////console.log('INPUT');
    //clean_p();
    setScenenumber();
    setDialoguenumber();
    if(saving_data){
        saving_data.abort();
    }
    $('#saveBtn').get(0).style.setProperty('background', '');
    if(lang == 1){
        $('#saveBtn').prop('disabled', false).html('Save');
    }else if(lang == 2){
        $('#saveBtn').prop('disabled', false).html('ت احفظ');
    }
    
    if(saving_timer != undefined){
        clearTimeout(saving_timer);
    }
    saving_timer = setTimeout(function(){
        saveProjects(project_id);
    }, 1000);
    
    //
    var pages = document.getElementsByClassName('page');
    var page_contents = document.getElementsByClassName('page_content');
    //////////////////////console.log('L : ' + pages.length);
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i].childNodes[0];
        let childrenHeight = getChildrenHeight(page) - lineHeight;//getChildrenHeight($(".page_content")); //- ;
        ////////////console.log('childrenHeight - '+(i+1)+' : ' + childrenHeight);
        //remove empty page    
      ////// a bit of code to disable the the overflew of the last child in a page
   /*   if(childrenHeight > maxHeight) {
     $(".page_content").lastChild.attr("disabled", "disabled");
      }else{
     $(".page_content").removeAttr("disabled");
    };*/
      //////
      //var jghfh = page.offsetHeight;//page.getElementsByClassName('page_content').height();
      // var jghfh = $(".page_wrapper").eq(i).childNodes[0].height();//offset().top;
       // var jghfh = document.getElementsByClassName('page')[i].item(0).offsetHeight;
        //var jhghgjhg = $(".page_wrapper")[0].eq(i).getElementsByTagName('div').offsetHeight;
      
      var page_content_height = page_contents[i].offsetHeight;
      /*for debuging
      console.log("the page_content height"+ page_content_height+"page height is" + pages[i].offsetHeight+"i is "+i);
      console.log("pages-length"+pages.length);*/
      
      /* code writen by me to mesure height
      var hjgdjfgfj = 0;
      $(".page_content p").children().each(function(){
            hjgdjfgfj += $(this).outerHeight(true); // true = include margins  .length
      });
      var jhghgjhg = 0;
      $(".page_wrapper").eq(i).children().each(function(){
            jhghgjhg = $(this).outerHeight(true); // true = include margins  .length
      });
      
      
      //var bitbito = $(".page_content").length
     /* for (let bitbito = 0; bitbito < $(".page_content p").length; bitbito++) {
        var bagabaga = $(this).outerHeight(true);//$(".page_content")[bitbito+1].height();
          hjgdjfgfj = hjgdjfgfj + bagabaga;
      }
      console.log("height1 is " + hjgdjfgfj);
      console.log("length is " + $(".page_content p").length);
      console.log("childrenHeight" + childrenHeight);
      lineHeight
      console.log(".page_content p length" + $(".page_content p").height());
      
      console.log("lineHeight" + lineHeight);
      
      console.log("height2 is " + $(".page_content").height());
      */
      //////
        if (childrenHeight === -17 && i > 0) {
            page.parentNode.remove();
            setTimeout(function(){
                //resizePages(Number($('#resizeBtn span').attr('data-size')));
            }, 20);
            //pages[i-1].focus();
            //const lastChild = pages[i-1].childNodes[0].lastChild;
            //setCaret(lastChild, lastChild.childNodes.length);
         // childrenHeight = page_contents[i].offsetHeight
        }else if(page_content_height > 830){//else if(hjgdjfgfj > 393) {//else if(childrenHeight > maxHeight) { // current page childrens' height bigger than page itself
            console.log('MAX_HEIGHT');
          
          //$(".page_content").lastChild.attr("disabled", "disabled");
          // $(".page_content").lastChild.remove();
          
            let children = page.childNodes;
            let children_length = children.length - 1;
            //let backup = children[children_length].cloneNode(true);

            let last_offset = getSelection().anchorOffset;
            let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
	    if(selection == null){
                selection = getSelection().anchorNode;
            };
            //////////////////////////console.log(selection);
            let last_child = page.lastChild;
            //////////////////////////console.log(last_child);

            //var text = last_child.textContent;
            //var clientHeight = (childrenHeight - maxHeight);
            /*if(last_child.classList.contains('dialogue')){
                var total_lines = wrapText(text, 38);
            }else{
                var total_lines = wrapText(text, 61);
            }
            
            ////////////console.log('total_lines: ' + total_lines);
            ////////////console.log(total_lines);
            var total_overflow = clientHeight / lineHeight;
            ////////////console.log(total_overflow);
            var total_keep = (total_lines.length - total_overflow).toFixed();
            ////////////console.log(total_keep);
            if(last_child.classList.contains('dialogue')){
                ////////console.log("SN: " + ((38 * total_keep) + (total_lines.length - 1)));
                ////////console.log("SN2: " + (total_lines.length - 1));
                //var newText = text.substr(0, ((38 * total_keep) + (total_lines.length - 1)));
                //var newTextRest = text.substr(((38 * total_keep) + (total_lines.length - 1)), text.length);

                var newText = text.substr(0, (38 * total_keep));
                var newTextRest = text.substr((38 * total_keep), text.length);
            }else{
                var newText = text.substr(0, (61 * total_keep));
                var newTextRest = text.substr((61 * total_keep), text.length);
            }
            
            var randomStringClass = randomString(8);
            if(newText == ''){
                last_child.remove();
            }else{
                if(last_child.getAttribute('data-class') == '' || last_child.getAttribute('data-class') == undefined || last_child.getAttribute('data-class') == null){
                    last_child.setAttribute('data-class', randomStringClass);
                }
                last_child.textContent = newText;
            }
            

            ////////////////////////console.log('clientHeight: ' + clientHeight);
            ////////////////////////console.log('total_lines: ' + total_lines);
            ////////////////////////console.log(total_lines);
            ////////////////////////console.log('total_keep: ' + total_keep);
            ////////////////////////console.log('newText: ' + newText);


            if(selection == last_child){
                if(last_child.classList.contains('dialogue')){
                    if(last_offset < (38 * total_keep)){
                        setCaret(children[children_length].childNodes[0], last_offset);
                    }
                }else{
                    if(last_offset < (61 * total_keep)){
                        setCaret(children[children_length].childNodes[0], last_offset);
                    }
                }
                
            }*/
            
            
            if(pages.item(i + 1) === null) { //if(pages.item(i + 1).height() === undefined) { //next page doesn't exists, so create one 
                console.log('NEW PAGE');
                var newPage = page.parentNode.cloneNode(true);
                newPage.innerHTML = '';
                var page_content = document.createElement('div');
                page_content.classList.add('page_content');
                newPage.appendChild(page_content);

                var next_page = newPage.childNodes[0];
                if(selection == last_child){
                    var l = true;
                }else{
                    var l = false;
                }
                var old_last_child_length = (last_child.textContent).length;
                
                
                //newPage.childNodes[0].appendChild(backup);
                //var p = document.createElement('p');
                //newPage.childNodes[0].appendChild(p);
            

                var c = 0;
                function gen(last_child){
                    var last_child_length = (last_child.textContent).length;
                    var total_lines = getNumlines(last_child);
                    var last_child_height = last_child.offsetHeight;
                  
                    
                   var extra_height = (childrenHeight - maxHeight);
                    //var extra_height = (page_content_height  - 700);
                    
                  
                    var line_height = last_child_height / total_lines;
                  
                    //var total_extra_lines = extra_height / line_height;
                  

                    //console.log('last_child_length', last_child_length);
                    //console.log('total_lines', total_lines);
                    //console.log('last_child_height', last_child_height);
                    //console.log('extra_height', extra_height);
                    //console.log('line_height', line_height);
                    //console.log('total_extra_lines', total_extra_lines);
                  

                    if(total_extra_lines > total_lines){
                        var total_keep_lines = total_extra_lines - total_lines;
                    }else{
                        var total_keep_lines = total_lines - total_extra_lines;
                    };
                  
                    var total_extra_lines = page_content_height;
                    total_keep_lines = 830;
                  
                    
                  // debuging start
                  /*
                     console.log("last_child_length" + last_child_length);
                  
                     console.log("total_lines" + total_lines );
                     console.log("last_child_height" + last_child_height);
                     console.log("extra_height" + extra_height);
                     console.log("line_height" + line_height);
                     console.log("total_extra_lines" + total_extra_lines);
                     console.log("total_keep_lines" + total_keep_lines);*/
                     // debuging end

                    var last_child_backup2 = last_child.cloneNode(true);
                    var last_child_backup = last_child.cloneNode(true);
                    
                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        $(last_child).children('span').splitLines({
                            tag: '<break>'
                        });
                        var splits_p = last_child.cloneNode(true);
                        last_child.childNodes[0].innerHTML = last_child_backup.childNodes[0].innerHTML;
                    }else{
                        $(last_child).splitLines({
                            tag: '<break>'
                        });
                        var splits_p = last_child.cloneNode(true);
                        last_child.innerHTML = last_child_backup.innerHTML;
                    }
                    
                    if(total_extra_lines > 0){
                        var randomStringClass = randomString(8);
                        if(next_page.childNodes[0]){
                            if(next_page.childNodes[0].classList.contains('scenenumber')){
                                var next_page_first_child = next_page.childNodes[1];
                            }else{
                                var next_page_first_child = next_page.childNodes[0];
                            }
                        }else{
                            var next_page_first_child = last_child.cloneNode(true);
                            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                next_page_first_child.childNodes[0].innerHTML = '<br>';
                            }else{
                                next_page_first_child.innerHTML = '<br>';
                            }
                        }

                        //console.log(next_page_first_child);


                        /*if(next_page.childNodes[0] && next_page.childNodes[0].classList.contains('scenenumber')){
                            var next_page_first_child = next_page.childNodes[1];
                        }else{
                            var next_page_first_child = next_page.childNodes[0];
                        }*/

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            last_child_backup2.childNodes[0].innerHTML = '';
                        }else{
                            last_child_backup2.innerHTML = '';
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            if(total_extra_lines > total_lines){
                                for (let index = 0; index < splits_p.childNodes[0].childNodes.length; index++) {
                                    if(splits_p.childNodes[0].childNodes[index] != null){
                                        last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;
                                    }
                                }
                            }else{
                                for (let index = Number(total_keep_lines); index < splits_p.childNodes[0].childNodes.length; index++) {
                                    if(splits_p.childNodes[0].childNodes[index] != null){
                                        last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;
                                    }
                                }
                            }
                        }else{
                            if(total_extra_lines == total_lines){
                                for (let index = 0; index < splits_p.childNodes.length; index++) {
                                    if(splits_p.childNodes[index] != null){
                                        last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                    }
                                }
                            }else{
                                for (let index = Number(total_keep_lines); index < splits_p.childNodes.length; index++) {
                                    if(splits_p.childNodes[index] != null){
                                         last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                    }
                                }
                            }
                            
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            var extra_total_length = (last_child_backup2.childNodes[0].textContent).length;
                            var last_total_keep_texts = (last_child.childNodes[0].textContent).substr(0, ((last_child.childNodes[0].textContent).length - extra_total_length));
                            last_child.childNodes[0].innerHTML = last_total_keep_texts;
                        }else{
                            var extra_total_length = (last_child_backup2.textContent).length;
                            var last_total_keep_texts = (last_child.textContent).substr(0, ((last_child.textContent).length - extra_total_length));
                            last_child.innerHTML = last_total_keep_texts;
                        }

                        if(next_page_first_child && next_page_first_child.classList.contains(last_child.getAttribute('data-class')) == true){
                            var next_offset = true;
                            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                next_page_first_child.childNodes[0].innerHTML = (last_child_backup2.childNodes[0].innerHTML).trim() + ' ' + next_page_first_child.childNodes[0].innerHTML;
                            }else{
                                next_page_first_child.innerHTML = (last_child_backup2.innerHTML).trim() + ' ' + next_page_first_child.innerHTML;
                            }
                        }else{
                            var next_offset = false;
                            last_child.setAttribute('data-class', randomStringClass);
                            last_child_backup2.classList.add(last_child.getAttribute('data-class'));
                            next_page.prepend(last_child_backup2);
                        }
                        
                        if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                            if(next_page_first_child.childNodes[0].innerHTML == ''){
                                next_page_first_child.childNodes[0].innerHTML = '<br>';
                            }
                        }else{
                            if(next_page_first_child.innerHTML == ''){
                                next_page_first_child.innerHTML = '<br>';
                            }
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            if((last_child.childNodes[0].textContent).length == 0){
                                last_child.remove();
                            }
                        }else{
                            if((last_child.textContent).length == 0){
                                last_child.remove();
                            }
                        }
                        
                        
                        //console.log('next_page_first_child');
                        //console.log(next_page_first_child);
                        //console.log('next_page_first_child');
                        setTimeout(function(){
                            setPageno();
                            setScenenumber();
                            //console.log('next_page_first_child');
                            //console.log(next_page_first_child);
                            //console.log(next_page);
                            //console.log('next_page_first_child');
                            if(selection == last_child){
                                
                                /*var total_height = (next_page.parentNode.offsetHeight * Number($('.page').length));
                                ////console.log("total_height: " + total_height);
                                
                                var half_height = (next_page.parentNode.offsetHeight / 2);
                                ////console.log("half_height: " + half_height);

                                var page_height = total_height - next_page.parentNode.offsetHeight;

                                ////console.log(page_height);

                                $('.dashboard_content').animate({
                                    scrollTop: (page_height + 700) - ($('.dashboard_content').height() / 2)
                                }, 300);*/

                                $('.dashboard_content').animate({
                                    scrollTop: ($('.dashboard_content').scrollTop() + ($(next_page).offset().top - $('.dashboard_content').offset().top)) - 500
                                });

                                

                                
                                if(next_page.childNodes[0] && next_page.childNodes[0].classList.contains('scenenumber')){
                                    var next_page_first_child = next_page.childNodes[1];
                                }else{
                                    var next_page_first_child = next_page.childNodes[0];
                                }
                                
                                var next_page_last_child = next_page.lastChild;
                                //console.log(next_page_first_child);
                                //console.log(next_page_first_child.innerHTML);
                                if(l == false){
                                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                                        if(next_page_first_child.childNodes[0].innerHTML == ''){
                                            next_page_first_child.childNodes[0].innerHTML = '<br>';
                                        }
                                        //console.log(next_page_first_child);
                                        //console.log(next_page_first_child.innerHTML);
                                      
                                        if(next_page_first_child && last_offset >= last_child_length){
                                            
                                            if(next_offset == true){
                                                //console.log('THIS1');
                                                setCaret(next_page_first_child.childNodes[0].childNodes[0], 0);
                                            }else{
                                                //console.log("THIS2");
                                                ////console.log(next_page_first_child);
                                                ////console.log(next_page_first_child.childNodes[0].childNodes[0]);
        
                                                setCaret(next_page_first_child.childNodes[0].childNodes[0], next_page_first_child.childNodes[0].childNodes[0].length);
                                                
                                            }
                                        }else if(next_offset == false){
                                            //console.log('THIS8');
                                            setCaret(last_child.childNodes[0].childNodes[0], last_offset);
                                        }else{
                                            //console.log('THIS3');
                                            setCaret(last_child.childNodes[0].childNodes[0], last_offset);
                                        }
                                    }else{
                                        
                                        if(next_page_first_child.innerHTML == ''){
                                            next_page_first_child.innerHTML = '<br>';
                                        }
                                        //console.log(next_page_first_child);
                                        //console.log(next_page_first_child.innerHTML);
                                        ////console.log('last_offset: ', last_offset);
                                        ////console.log('last_child_length: ', last_child_length);
                                        if(next_page_first_child && last_offset >= last_child_length){
                                            if(next_offset == true){
                                                //console.log('THIS4');
                                                setCaret(next_page_first_child.childNodes[0], 0);
                                            }else{
                                                //console.log('THIS5');
                                                setCaret(next_page_first_child.childNodes[0], next_page_first_child.childNodes[0].length);
                                            }
                                        }else if(next_offset == false){
                                            //console.log('THIS7');
                                            setCaret(last_child.childNodes[0], last_offset);
                                        }else{
                                            //console.log('THIS6');
                                            setCaret(last_child.childNodes[0], last_offset);
                                        }
                                    }
                                }else if(l == true){
                                      //console.log("OKKKK");

                                    if(next_page_last_child.classList.contains('sceneheading') || next_page_last_child.classList.contains('dialogue')){

                                        if(next_page_last_child.childNodes[0].innerHTML == ''){

                                            next_page_last_child.childNodes[0].innerHTML = '<br>';

                                        }

                                    }else{

                                        if(next_page_last_child.innerHTML == ''){

                                            next_page_last_child.innerHTML = '<br>';

                                        }

                                    };

                                    //console.log(next_page_last_child);

                                   // old_last_child_length = (old_last_child_length - 1);

                                    if(next_page_last_child.classList.contains('sceneheading') || next_page_last_child.classList.contains('dialogue')){

                                      
                                        if(last_offset > (next_page_last_child.childNodes[0].childNodes[0].textContent).length){

                                            if(old_last_child_length == last_offset){

                                                setCaret(next_page_last_child.childNodes[0].childNodes[0], (next_page_last_child.childNodes[0].childNodes[0].textContent).length);

                                            }else{

                                                setCaret(next_page_last_child.childNodes[0].childNodes[0], 0);

                                            }

                                            

                                        }else{

                                            setCaret(next_page_last_child.childNodes[0].childNodes[0], last_offset);

                                        }

                                        

                                    }else{

                                        if(last_offset > (next_page_last_child.childNodes[0].textContent).length){

                                            //console.log(old_last_child_length);

                                            //console.log(last_offset);
                                          

                                            if(old_last_child_length == last_offset){

                                                setCaret(next_page_last_child.childNodes[0], (next_page_last_child.childNodes[0].textContent).length);

                                            }else{

                                                setCaret(next_page_last_child.childNodes[0], 0);

                                            }

                                        }else{

                                            setCaret(next_page_last_child.childNodes[0], last_offset);

                                        }

                                        

                                    }

                                    

                                }

                                

                            }

                        }, 0);

                        
                    }

                    

                    if(total_extra_lines > total_lines){
                        ////console.log(page.lastChild);
                        ////console.log(page);
                        if(c == 0){
                            c = 1;
                            //gen(page.lastChild);

                        }
                    }
                }
               // gen(last_child);
              gen(page.lastChild);


                page.parentNode.parentNode.appendChild(newPage);

                //page.parentNode.parentNode.appendChild(newPage);

                /*if(newTextRest != ''){
                    backup.textContent = newTextRest;
                }
                if(last_child.getAttribute('data-class') != null){
                    backup.classList.add(last_child.getAttribute('data-class'));
                }
                newPage.childNodes[0].appendChild(backup);
                page.parentNode.parentNode.appendChild(newPage);
                

                //////////////////////////console.log();
                //children[children_length].remove();
                setTimeout(function(){
                    resizePages(Number($('#resizeBtn span').attr('data-size')));
                }, 20);
                if(last_child === selection) {
                    //////////////////////////console.log('last_offset: ' + last_offset);
                    if(last_offset >= 61){

                    }
                    //////////////////////////console.log(newPage.childNodes[0].childNodes[0].childNodes[0]);
                    //////////////////////////console.log(last_offset);
                    //////////////////////////console.log('SN: ');
                    //////////////////////////console.log(pages[i + 1].childNodes[0].childNodes[0].find('p'));


                    //////////////////////////console.log('nodeType: ' + pages[i + 1].childNodes[0].childNodes[0].nodeType);
                    //////////////////////////console.log('text: ' + pages[i + 1].childNodes[0].childNodes[0].textContent);
                    //////////////////////////console.log('node: ' + pages[i + 1]);
                    //////////////////////////console.log(pages[i + 1].children[0].children[0]);
                    //if()
                    ////////////////////////console.log('last_offset: ' + last_offset);

                    if(last_offset >= (61 * total_keep)){
                        //setCaret(pages[i + 1].childNodes[0].childNodes[0].childNodes[0], last_offset);
                    }else{
                        //setCaret(pages[i + 1].childNodes[0].childNodes[0], last_offset);
                    }
                    ////////console.log('last_offset: ' + last_offset);
                    if(last_child.classList.contains('dialogue')){
                        if(last_offset <= 0){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0], last_offset);
                        }else if(last_offset >= (38 * total_keep)){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0].childNodes[0], pages[i + 1].childNodes[0].childNodes[0].childNodes[0].length);
                        }
                    }else{
                        if(last_offset <= 0){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0], last_offset);
                        }else if(last_offset >= (61 * total_keep)){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0].childNodes[0], pages[i + 1].childNodes[0].childNodes[0].childNodes[0].length);
                        }
                    }
                    
                    
                    //focusNewElement(newPage.childNodes[0].childNodes[0]);
                    //newPage.childNodes[0].childNodes[0]
                    //setSelection(backup, 0);
                }*/

                //children[children_length].remove();

                //;
                //newPage.focus();
                //onsole.log("NEW PAGE");
            }else{ // next page exists, so just move contents
                //console.log("PREV");
                   console.log("last_child-up" , page.lastChild);
                var c = 0;
                function gen(last_child){
                  console.log(last_child);
                   console.log("fine");
                 
                    //var total_lines = getNumlines(last_child);
                  var total_lines = 800;
                    console.log("total_lines"+total_lines);
                    var last_child_height = last_child.offsetHeight;
                    var extra_height = (childrenHeight - maxHeight);
                    var line_height = last_child_height / total_lines;
                    
                   console.log("last_child-up2" , last_child);
                    var total_extra_lines = (extra_height / line_height);

                    if(total_extra_lines > total_lines){
                        var total_keep_lines = total_extra_lines - total_lines;
                    }else{
                        var total_keep_lines = total_lines - total_extra_lines;
                    };
                      // debuging start
                     //console.log("last_child_length" + last_child_length);
                    
                     var total_extra_lines = page_content_height;
                    total_keep_lines = 800;
                  
                    
                  
                     console.log("total_lines" + total_lines );
                     console.log("last_child_height" + last_child_height);
                     console.log("extra_height" + extra_height);
                     console.log("line_height" + line_height);
                     console.log("total_extra_lines" + total_extra_lines);
                     console.log("total_keep_lines" + total_keep_lines);
                     // debuging end

                    var last_child_backup2 = last_child.cloneNode(true);
                    var last_child_backup = last_child.cloneNode(true);
                    console.log("last_child" , last_child);
                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        $(last_child).children('span').splitLines({
                            tag: '<break>'
                        });
                        var splits_p = last_child.cloneNode(true);
                        last_child.childNodes[0].innerHTML = last_child_backup.childNodes[0].innerHTML;
                    }else{
                        $(last_child).splitLines({
                            tag: '<break>'
                        });
                        var splits_p = last_child.cloneNode(true);
                        last_child.innerHTML = last_child_backup.innerHTML;
                    }
                    
                    if(total_extra_lines > 0){
                        var next_page = pages.item(i + 1).childNodes[0];
                        var randomStringClass = randomString(8);

                        if(next_page.childNodes[0]){
                            if(next_page.childNodes[0].classList.contains('scenenumber')){
                                var next_page_first_child = next_page.childNodes[1];
                            }else{
                                var next_page_first_child = next_page.childNodes[0];
                            }
                        }else{
                            var next_page_first_child = last_child.cloneNode(true);
                            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                next_page_first_child.childNodes[0].innerHTML = '';
                            }else{
                                next_page_first_child.innerHTML = '';
                            }
                        }


                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            last_child_backup2.childNodes[0].innerHTML = '';
                        }else{
                            last_child_backup2.innerHTML = '';
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            if(total_extra_lines > total_lines){
                                for (let index = 0; index < splits_p.childNodes[0].childNodes.length; index++) {
                                    if(splits_p.childNodes[0].childNodes[index] != null){
                                        last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;
                                    }
                                }
                            }else{
                                for (let index = Number(total_keep_lines); index < splits_p.childNodes[0].childNodes.length; index++) {
                                    if(splits_p.childNodes[0].childNodes[index] != null){
                                        last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;
                                    }
                                }
                            }
                        }else{
                            if(total_extra_lines > total_lines){
                                for (let index = 0; index < splits_p.childNodes.length; index++) {
                                    if(splits_p.childNodes[index] != null){
                                        last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                    }
                                }
                            }else{
                                for (let index = Number(total_keep_lines); index < splits_p.childNodes.length; index++) {
                                    if(splits_p.childNodes[index] != null){
                                        last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                    }
                                }
                            }
                            
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            var extra_total_length = (last_child_backup2.childNodes[0].textContent).length;
                            var last_total_keep_texts = (last_child.childNodes[0].textContent).substr(0, ((last_child.childNodes[0].textContent).length - extra_total_length));
                            last_child.childNodes[0].innerHTML = last_total_keep_texts;
                        }else{
                            var extra_total_length = (last_child_backup2.textContent).length;
                            var last_total_keep_texts = (last_child.textContent).substr(0, ((last_child.textContent).length - extra_total_length));
                            last_child.innerHTML = last_total_keep_texts;
                        }

                        if(next_page_first_child.classList.contains(last_child.getAttribute('data-class')) == true){
                            var next_offset = true;
                            //console.log('this1');
                            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                next_page_first_child.childNodes[0].innerHTML = (last_child_backup2.childNodes[0].innerHTML).trim() + ' ' + next_page_first_child.childNodes[0].innerHTML;
                            }else{
                                next_page_first_child.innerHTML = (last_child_backup2.innerHTML).trim() + ' ' + next_page_first_child.innerHTML;
                            }
                        }else{
                            //console.log('this2');
                            var next_offset = false;
                            last_child.setAttribute('data-class', randomStringClass);
                            last_child_backup2.classList.add(last_child.getAttribute('data-class'));
                            next_page.prepend(last_child_backup2);
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            if((last_child.childNodes[0].textContent).length == 0){
                                last_child.remove();
                            }
                        }else{
                            if((last_child.textContent).length == 0){
                                last_child.remove();
                            }
                        }
                        

                        if(selection == last_child){
                            
                            if(next_page.childNodes[0].classList.contains('scenenumber')){
                                var next_page_first_child = next_page.childNodes[1];
                            }else{
                                var next_page_first_child = next_page.childNodes[0];
                            }
                            //console.log('next_page_first_child');
                            //console.log(next_page_first_child);
                            //console.log('next_page_first_child');
                            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                if(next_page_first_child.childNodes[0].innerHTML == ''){
                                    next_page_first_child.childNodes[0].innerHTML = '<br>';
                                }
                            }else{
                                if(next_page_first_child.innerHTML == ''){
                                    next_page_first_child.innerHTML = '<br>';
                                }
                            }
                            if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                                if(Number(localStorage.getItem('prev_last_child_length')) > 0){
                                    setCaret(last_child.childNodes[0].childNodes[0], Number(localStorage.getItem('prev_last_child_length')));
                                }else{
                                    if(last_offset >= (last_child.textContent).length){
                                        ////console.log(next_page_first_child);
                                        if(next_offset == true){
                                            setCaret(next_page_first_child.childNodes[0].childNodes[0], 0);
                                        }else{
                                            setCaret(next_page_first_child.childNodes[0].childNodes[0], next_page_first_child.childNodes[0].childNodes[0].length);
                                        }
                                    }else{
                                        setCaret(last_child.childNodes[0].childNodes[0], last_offset);
                                    }
                                }
                                
                            }else{
                                if(Number(localStorage.getItem('prev_last_child_length')) > 0){
                                    setCaret(last_child.childNodes[0], Number(localStorage.getItem('prev_last_child_length')));
                                }else{
                                    if(last_offset >= (last_child.textContent).length){
                                        if(next_offset == true){
                                            setCaret(next_page_first_child.childNodes[0], 0);
                                        }else{
                                            setCaret(next_page_first_child.childNodes[0], next_page_first_child.childNodes[0].length);
                                        }
                                    }else{
                                        setCaret(last_child.childNodes[0], last_offset);
                                    }
                                }
                            }
                        }
                    }

                    setScenenumber();

                    if(total_extra_lines > total_lines){
                        ////console.log(page.lastChild);
                        ////console.log(page);
                        if(c == 0){
                            c = 1;
                            //gen(page.lastChild);
                        }
                    }

                }
               
              gen(page.lastChild);
              /*
              find('.child:last')
         let last_child = page.last()
              let last_child = page.find('.child:last')
              gen(last_child);*/
             // gen(lastChild);
              console.log("1");
              console.log("dddd",page.lastChild);
              page_content_height = 700;

                


                

                //var next_page = pages.item(i + 1).childNodes[0];
                ////////////console.log('S');
                ////////////console.log(selection.classList);
              //start
                if(selection == last_child){
                    if(next_page.childNodes[0].classList.contains(last_child.getAttribute('data-class')) == true){
                        next_page.childNodes[0].textContent = newTextRest + next_page.childNodes[0].textContent;
                    }else{
                        var p = document.createElement('p');
                        for (let x of selection.classList.values()) {
                            p.classList.add(x);
                        }
                        //p.classList.add(selection.classList.values());
                        if(newTextRest == ''){
                            p.innerHTML = '<br>';
                        }else{
                            p.textContent = newTextRest;
                        }
                        if(last_child.getAttribute('data-class') != null){
                            p.classList.add(last_child.getAttribute('data-class'));
                        }
                        next_page.prepend(p);
                    }
                }else{
                    if(next_page.childNodes[0].classList.contains(last_child.getAttribute('data-class')) == true){
                        next_page.childNodes[0].textContent = newTextRest + next_page.childNodes[0].textContent;
                    }else{
                        var p = document.createElement('p');
                        for (let x of selection.classList.values()) {
                            p.classList.add(x);
                        }
                        //p.classList.add(selection.classList.values());
                        if(newTextRest == ''){
                            p.innerHTML = '<br>';
                        }else{
                            p.textContent = newTextRest;
                        }
                        if(last_child.getAttribute('data-class') != null){
                            p.classList.add(last_child.getAttribute('data-class'));
                        }
                        next_page.prepend(p);
                    }
                }
                if(last_child === selection) {
                    
                    if(last_child.classList.contains('dialogue')){
                        if(last_offset <= 0){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0], last_offset);
                        }else if(last_offset >= (38 * total_keep)){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0].childNodes[0], pages[i + 1].childNodes[0].childNodes[0].childNodes[0].length);
                        }
                    }else{
                        if(last_offset <= 0){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0], last_offset);
                        }else if(last_offset >= (61 * total_keep)){
                            setCaret(pages[i + 1].childNodes[0].childNodes[0].childNodes[0], pages[i + 1].childNodes[0].childNodes[0].childNodes[0].length);
                        }
                    }
                    
                }
                // */ end
          } 
        }else if(childrenHeight < maxHeight - lineHeight && pages.item(i + 1)){
           // console.log('SPACE');
            let last_child = page.lastChild;
            let last_offset = getSelection().anchorOffset;
            var next_page = pages.item(i + 1).childNodes[0];
            if(next_page.childNodes[0].classList.contains('scenenumber')){
                var next_page_first_child = next_page.childNodes[1];
            }else{
                var next_page_first_child = next_page.childNodes[0];
            }
          ///trying start
         /*  var end = page.childNodes[0].length;
            page.childNodes[0].setSelectionRange(end, end);
            page.childNodes[0].focus();*/


          /////trying end
          

            if(next_page_first_child.classList.contains(last_child.getAttribute('data-class')) == true){
                if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                    var next_page_first_child_html = next_page_first_child.childNodes[0].innerHTML;
                }else{
                    var next_page_first_child_html = next_page_first_child.innerHTML;
                }

                if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                    last_child.childNodes[0].innerHTML = (last_child.childNodes[0].innerHTML).trim() + ' ' + next_page_first_child_html;
                }else{
                    last_child.innerHTML = (last_child.innerHTML).trim() + ' ' + next_page_first_child_html;
                }
                next_page_first_child.remove();
            }else{
                page.appendChild(next_page_first_child);
            }

          //  next_page_first_child.remove();
                    ///trying start



          /////trying end

            let children = page.childNodes;
            let children_length = children.length - 1;
            //let backup = children[children_length].cloneNode(true);

            //let last_offset = getSelection().anchorOffset;
            let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
            if(selection == null){
                selection = getSelection().anchorNode;
            }
            var childrenHeight2 = getChildrenHeight(page) - lineHeight;
            //////////////////////////console.log(selection);
            //let last_child = page.lastChild;
            var c = 0;
            function gen(last_child){
                var total_lines = getNumlines(last_child);
                var last_child_height = last_child.offsetHeight;
                var extra_height = (childrenHeight2 - maxHeight);
                var line_height = last_child_height / total_lines;
                var total_extra_lines = extra_height / line_height;

                if(total_extra_lines > total_lines){
                    var total_keep_lines = total_extra_lines - total_lines;
                }else{
                    var total_keep_lines = total_lines - total_extra_lines;
                };
                 var total_extra_lines = page_content_height;
                 total_keep_lines = 800;
                ////console.log('total_lines', total_lines);
                ////console.log('total_extra_lines', total_extra_lines);
                ////console.log('total_keep_lines', total_keep_lines);
                                // debuging start
                     //console.log("last_child_length" + last_child_length);
                     //console.log("good tel now");
                     console.log("total_lines" + total_lines );
                     console.log("last_child_height" + last_child_height);
                     console.log("extra_height" + extra_height);
                     console.log("line_height" + line_height);
                     console.log("total_extra_lines" + total_extra_lines);
                     console.log("total_keep_lines" + total_keep_lines);
                     // debuging end

                var last_child_backup2 = last_child.cloneNode(true);
                var last_child_backup = last_child.cloneNode(true);
                
                if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                    $(last_child).children('span').splitLines({
                        tag: '<break>'
                    });
                    var splits_p = last_child.cloneNode(true);
                    last_child.childNodes[0].innerHTML = last_child_backup.childNodes[0].innerHTML;
                }else{
                    $(last_child).splitLines({
                        tag: '<break>'
                    });
                    var splits_p = last_child.cloneNode(true);
                    last_child.innerHTML = last_child_backup.innerHTML;
                }
                
                if(total_extra_lines >= 0){
                    var next_page = pages.item(i + 1).childNodes[0];
                    var randomStringClass = randomString(8);
                    if(next_page.childNodes[0]){
                        if(next_page.childNodes[0].classList.contains('scenenumber')){
                            var next_page_first_child = next_page.childNodes[1];//1];
                        }else{
                            var next_page_first_child = next_page.childNodes[0];//0];
                        }
                    }else{
                        var next_page_first_child = last_child.cloneNode(true);
                        if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                            next_page_first_child.childNodes[0].innerHTML = '';
                        }else{
                            next_page_first_child.innerHTML = '';
                        }
                    }
                    console.log("next_page_first_child",next_page_first_child);

                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        last_child_backup2.childNodes[0].innerHTML = '';
                    }else{
                        last_child_backup2.innerHTML = '';
                    }

                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        if(total_extra_lines > total_lines){
                            for (let index = 0; index < splits_p.childNodes[0].childNodes.length; index++) {
                                if(splits_p.childNodes[0].childNodes[index] != null){
                                    last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;
                                }
                            }
                        }else{
                            for (let index = Number(total_keep_lines); index < splits_p.childNodes[0].childNodes.length; index++) {
                                if(splits_p.childNodes[0].childNodes[index] != null){
                                    last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;
                                }
                            }
                        }
                    }else{
                        if(total_extra_lines > total_lines){
                            for (let index = 0; index < splits_p.childNodes.length; index++) {
                                if(splits_p.childNodes[index] != null){
                                    last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                }
                            }
                        }else{
                            for (let index = Number(total_keep_lines); index < splits_p.childNodes.length; index++) {
                                if(splits_p.childNodes[index] != null){
                                    last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                }
                            }
                        }
                        
                    }

                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        var extra_total_length = (last_child_backup2.childNodes[0].textContent).length;
                        var last_total_keep_texts = (last_child.childNodes[0].textContent).substr(0, ((last_child.childNodes[0].textContent).length - extra_total_length));
                        last_child.childNodes[0].innerHTML = last_total_keep_texts;
                    }else{
                        var extra_total_length = (last_child_backup2.textContent).length;
                        var last_total_keep_texts = (last_child.textContent).substr(0, ((last_child.textContent).length - extra_total_length));
                        last_child.innerHTML = last_total_keep_texts;
                    }

                    if(next_page_first_child?.classList.contains(last_child.getAttribute('data-class')) == true){
                        var next_offset = true;
                        if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                            next_page_first_child.childNodes[0].innerHTML = (last_child_backup2.childNodes[0].innerHTML).trim() + ' ' + next_page_first_child.childNodes[0].innerHTML;
                        }else{
                            next_page_first_child.innerHTML = (last_child_backup2.innerHTML).trim() + ' ' + next_page_first_child.innerHTML;
                            
                        }
                    }else{
                        var next_offset = false;
                        last_child.setAttribute('data-class', randomStringClass);
                        last_child_backup2.classList.add(last_child.getAttribute('data-class'));
                        next_page.prepend(last_child_backup2);
                    }

                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        if((last_child.childNodes[0].textContent).length == 0){
                            last_child.remove();
                        }
                    }else{
                        if((last_child.textContent).length == 0){
                            last_child.remove();
                        }
                    }
                  //var end = z.length;

          //  page.childNodes[0].focus();
// i have done this
                  ///*
                    if(selection == last_child){
                        if(next_page.childNodes[0].classList.contains('scenenumber')){
                            var next_page_first_child = next_page.childNodes[1];
                        }else{
                            var next_page_first_child = next_page.childNodes[0];
                        }
                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            if(last_offset >= (last_child.textContent).length){
                                console.log("next_page_first_child",next_page_first_child);
                                if(next_offset == true){
                                    setCaret(next_page_first_child.childNodes[0].childNodes[0], 0);
                                }else{
                                    setCaret(next_page_first_child.childNodes[0].childNodes[0], next_page_first_child.childNodes[0].childNodes[0].length);
                                }
                            }else{
                                setCaret(last_child.childNodes[0].childNodes[0], last_offset);
                            }
                        }else{
                            if(last_offset >= (last_child.textContent).length){
                                if(next_offset == true){
                                    setCaret(next_page_first_child.childNodes[0], 0);
                                }else{
                                    setCaret(next_page_first_child.childNodes[0], next_page_first_child.childNodes[0].length);
                                }
                            }else{
                                setCaret(last_child.childNodes[0], last_offset);
                            }
                        }
                    }
                }else if(pages.item(i + 1).childNodes[0].childNodes.length == 0){
                    pages.item(i + 1).remove();
                }
//*/
                setScenenumber();

                if(total_extra_lines > total_lines){
                    ////console.log(page.lastChild);
                    ////console.log(page);
                    if(c == 0){
                        c = 1;
                        //gen(page.lastChild);
                    }
                }
              
            }
          gen(page.lastChild);
          
/*
            var end = page.childNodes[0].length;
              page.childNodes[0].setSelectionRange(end, end);
*/
            ////console.log('SN');
            }else if(pages.item(i + 1)){
            //console.log('SPACE WORDS');

            var childrenHeight2 = getChildrenHeight(page) - lineHeight;
              
            let last_child = page.lastChild;
            ////console.log('childrenHeight2', childrenHeight2);
            ////console.log('maxHeight', maxHeight);
            ////console.log('maxHeight - lineHeight', maxHeight - lineHeight);
              
            let old_last_offset = getSelection().anchorOffset;
            let last_offset = getSelection().anchorOffset;
            let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
            if(selection == null){
                selection = getSelection().anchorNode;
            }
            var old_selection = selection;
            var pageno = selection.parentNode.parentNode.getAttribute('pageno');


            var get_first = false;
            if(childrenHeight2 < maxHeight){
                get_first = true;
                
            }
            if(selection == last_child){
                get_first = true;
            }
              

            if(get_first == true){
                var next_page = pages.item(i + 1).childNodes[0];
                if(next_page.childNodes[0]){
                    if(next_page.childNodes[0].classList.contains('scenenumber')){
                        var next_page_first_child = next_page.childNodes[1];
                    }else{
                        var next_page_first_child = next_page.childNodes[0];
                    }
                }else{
                    var next_page_first_child = last_child.cloneNode(true);
                    if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                        next_page_first_child.childNodes[0].innerHTML = '';
                    }else{
                        next_page_first_child.innerHTML = '';
                    }
                }

                /*if(next_page.childNodes[0].classList.contains('scenenumber')){
                    var next_page_first_child = next_page.childNodes[1];
                }else{
                    var next_page_first_child = next_page.childNodes[0];
                }*/

                if(next_page_first_child.classList.contains(last_child.getAttribute('data-class')) == true){
                    if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                        var next_page_first_child_html = next_page_first_child.childNodes[0].innerHTML;
                    }else{
                        var next_page_first_child_html = next_page_first_child.innerHTML;
                    }

                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        last_child.childNodes[0].innerHTML = (last_child.childNodes[0].innerHTML).trim() + ' ' + next_page_first_child_html;
                    }else{
                        last_child.innerHTML = (last_child.innerHTML).trim() + ' ' ;//+ next_page_first_child_html;
                    }
                    //console.log('n r');
                    next_page_first_child.remove();
                    nd = false;
                }else{
                    //console.log('F');
                    //console.log(next_page_first_child);
                    //console.log(old_selection);
                    //console.log('F');
        
                    if(old_selection == next_page_first_child){
                        var old_first = true;
                    }else{
                        var old_first = false;
                    }
                    var nd = true;
                    if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                        if(next_page_first_child.childNodes[0].innerHTML != ''){
                            page.appendChild(next_page_first_child);
                        }
                    }/*else{
                        if(next_page_first_child.childNodes[0].innerHTML != ''){
                            page.appendChild(next_page_first_child);
                        }
                    }*/
                    //console.log(next_page_first_child);
                    //console.log('n ad');
                    //if(next_page_first_child)
                    //page.appendChild(next_page_first_child);
                }

                


                let children = page.childNodes;
                let children_length = children.length - 1;
                //let backup = children[children_length].cloneNode(true);

                //let last_offset = getSelection().anchorOffset;
                let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
                if(selection == null){
                    selection = getSelection().anchorNode;
                }
                var childrenHeight2 = getChildrenHeight(page) - lineHeight;
                //////////////////////////console.log(selection);
                //let last_child = page.lastChild;
                var c = 0;
                function gen(last_child){
                    var total_lines = getNumlines(last_child);
                    var last_child_height = last_child.offsetHeight;
                    var extra_height = (childrenHeight2 - maxHeight);
                    var line_height = last_child_height / total_lines;
                    var total_extra_lines = extra_height / line_height;
                    if(total_extra_lines > total_lines){
                        var total_keep_lines = total_extra_lines - total_lines;
                    }else{
                        var total_keep_lines = total_lines - total_extra_lines;
                    }

                    ////console.log('total_lines', total_lines);
                    ////console.log('total_extra_lines', total_extra_lines);
                    ////console.log('total_keep_lines', total_keep_lines);
                  var total_extra_lines = page_content_height;
                    total_keep_lines = 800;

                    var last_child_backup2 = last_child.cloneNode(true);
                    var last_child_backup = last_child.cloneNode(true);
                    
                    if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                        $(last_child).children('span').splitLines({
                            tag: '<break>'
                        });
                        var splits_p = last_child.cloneNode(true);
                        last_child.childNodes[0].innerHTML = last_child_backup.childNodes[0].innerHTML;
                    }else{
                        $(last_child).splitLines({
                            tag: '<break>'
                        });
                        var splits_p = last_child.cloneNode(true);
                        last_child.innerHTML = last_child_backup.innerHTML;
                    }
                    
                    if(total_extra_lines > 0){
                        var next_page = pages.item(i + 1).childNodes[0];
                        if(next_page.childNodes[0]){
                            if(next_page.childNodes[0].classList.contains('scenenumber')){
                                var next_page_first_child = next_page.childNodes[1];
                            }else{
                                var next_page_first_child = next_page.childNodes[0];
                            }
                        }else{
                            var next_page_first_child = last_child.cloneNode(true);
                            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                next_page_first_child.childNodes[0].innerHTML = '';
                            }else{
                                next_page_first_child.innerHTML = '';
                            }
                        }
                        var randomStringClass = randomString(8);

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            last_child_backup2.childNodes[0].innerHTML = '';
                        }else{
                            last_child_backup2.innerHTML = '';
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            if(total_extra_lines > total_lines){
                                for (let index = 0; index < splits_p.childNodes[0].childNodes.length; index++) {
                                    if(splits_p.childNodes[0].childNodes[index] != null){
                                        last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;  
                                   } 
                                }
                            }else{
                                for (let index = Number(total_keep_lines); index < splits_p.childNodes[0].childNodes.length; index++) {
                                    if(splits_p.childNodes[0].childNodes[index] != null){
                                        last_child_backup2.childNodes[0].innerHTML += splits_p.childNodes[0].childNodes[index].innerHTML;
                                    }
                                }
                            }
                        }else{
                            if(total_extra_lines > total_lines){
                                for (let index = 0; index < splits_p.childNodes.length; index++) {
                                    if(splits_p.childNodes[index] != null){
                                        last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                    }
                                }
                            }else{
                                for (let index = Number(total_keep_lines); index < splits_p.childNodes.length; index++) {
                                    if(splits_p.childNodes[index] != null){
                                        last_child_backup2.innerHTML += splits_p.childNodes[index].innerHTML;
                                    }
                                }
                            }
                            
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            var extra_total_length = (last_child_backup2.childNodes[0].textContent).length;
                            var last_total_keep_texts = (last_child.childNodes[0].textContent).substr(0, ((last_child.childNodes[0].textContent).length - extra_total_length));
                            last_child.childNodes[0].innerHTML = last_total_keep_texts;
                        }else{
                            var extra_total_length = (last_child_backup2.textContent).length;
                            var last_total_keep_texts = (last_child.textContent).substr(0, ((last_child.textContent).length - extra_total_length));
                            last_child.innerHTML = last_total_keep_texts;
                        }

                        if(next_page_first_child.classList.contains(last_child.getAttribute('data-class')) == true){
                            var next_offset = true;
                            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                next_page_first_child.childNodes[0].innerHTML = (last_child_backup2.childNodes[0].innerHTML).trim() + 's ' + (next_page_first_child.childNodes[0].innerHTML).trim();
                            }else{
                                next_page_first_child.innerHTML = (last_child_backup2.innerHTML).trim() + 's ' + (next_page_first_child.innerHTML).trim();
                            }
                        }else{
                            ////console.log('ISEE');
                            var next_offset = false;
                            last_child.setAttribute('data-class', randomStringClass);
                            last_child_backup2.classList.add(last_child.getAttribute('data-class'));
                            next_page.prepend(last_child_backup2);
                        }

                        if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                            if((last_child.childNodes[0].textContent).length == 0){
                                last_child.remove();
                            }
                        }else{
                            if((last_child.textContent).length == 0){
                                last_child.remove();
                            }
                        }

                        if(selection == last_child){
                            if(next_page.childNodes[0].classList.contains('scenenumber')){
                                var next_page_first_child = next_page.childNodes[1];
                            }else{
                                var next_page_first_child = next_page.childNodes[0];
                            }
                            if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                                if(last_offset >= (last_child.textContent).length){
                                    ////console.log(next_page_first_child);
                                    if(next_offset == true){
                                        //console.log('this1');
                                        setCaret(next_page_first_child.childNodes[0].childNodes[0], 0);
                                    }else{
                                        //console.log('this2');
                                        setCaret(next_page_first_child.childNodes[0].childNodes[0], next_page_first_child.childNodes[0].childNodes[0].length);
                                    }
                                }else{
                                    ////console.log('last_offset', last_offset);
                                    //console.log('this3');
                                    setCaret(last_child.childNodes[0].childNodes[0], last_offset);
                                }
                            }else{

                                if(last_offset >= (last_child.textContent).length){
                                    if(next_offset == true || (next_page_first_child.childNodes[0].length > 0)){
                                        //console.log('this4');
                                        setCaret(next_page_first_child.childNodes[0], 0);
                                    }else{
                                        //console.log('this5');
                                        setCaret(next_page_first_child.childNodes[0], next_page_first_child.childNodes[0].length);
                                    }
                                }else{
                                    ////console.log('last_offset', last_offset);
                                    //console.log('this6');
                                    setCaret(last_child.childNodes[0], last_offset);
                                }
                            }
                        }
                    }else{
                        //console.log('s');
                        if(selection == last_child){
                            if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                                //console.log('this7');
                              setCaret(last_child.childNodes[0].childNodes[0], last_offset);
                            }else{
                                //console.log('this8');
                                setCaret(last_child.childNodes[0], last_offset);
                            }
                        }
                    }

                    setScenenumber();

                    if(next_page?.childNodes[0].classList.contains('scenenumber')){
                        var next_page_first_child = next_page.childNodes[1];
                    }else{
                        var next_page_first_child = next_page.childNodes[0];
                    }

                    if(nd == true){
                        
                        if(Number(next_page_first_child.parentNode.parentNode.getAttribute('pageno')) == Number(pageno)){
                            if(old_first == true){
                                //console.log(next_page_first_child);
                                //console.log(next_page_first_child.parentNode.parentNode.getAttribute('pageno'));
                                //console.log(page);
                                //console.log("SN");
                                //console.log(old_selection);
                                //console.log("SN");
                                //console.log(old_first);
                                if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                                    //console.log('this_lol_1');
					console.log(typeof next_page_first_child.childNodes[0].childNodes[0]);
                                    setCaret(next_page_first_child.childNodes[0].childNodes[0], old_last_offset);
                                    
                                }else{
                                    //console.log('this_lol_2');
                                    //setCaret(next_page_first_child.childNodes[0], old_last_offset);
                                  
                                }
                            }
                            
                        }
                        
                        setCaret(next_page_first_child.childNodes[0], 0);
                    }

                    if(total_extra_lines > total_lines){
                        ////console.log(page.lastChild);
                        ////console.log(page);
                        if(c == 0){
                            c = 1;
                            //gen(page.lastChild);
                        }
                    }
                }
               gen(page.lastChild);
            }
            


            /*let last_child = page.lastChild;
            var next_page = pages.item(i + 1).childNodes[0];
            if(next_page.childNodes[0].classList.contains('scenenumber')){
                var next_page_first_child = next_page.childNodes[1];
            }else{
                var next_page_first_child = next_page.childNodes[0];
            }
            if(next_page_first_child.classList.contains('sceneheading') || next_page_first_child.classList.contains('dialogue')){
                var next_page_first_child_html = next_page_first_child.childNodes[0].innerHTML;
            }else{
                var next_page_first_child_html = next_page_first_child.innerHTML;
            }

            if(last_child.classList.contains('sceneheading') || last_child.classList.contains('dialogue')){
                last_child.childNodes[0].innerHTML = last_child.childNodes[0].innerHTML + next_page_first_child_html;
            }else{
                last_child.innerHTML = last_child.innerHTML + next_page_first_child_html;
            }*/
            
        }
        
        /*if(childrenHeight < maxHeight - lineHeight && pages.item(i + 1)) {
            ////console.log('OKAY 1');
            //////////console.log('HMM1');
            // if there is enough space on the page for one more line, remove it from the next page, and append it to this one
            //////////////////////console.log('GOT_SPACE');
            /*let last_child = page.lastChild;
            var next_page = pages.item(i + 1).childNodes[0];
            let firstChild = next_page.children[0];
            if(firstChild.classList.contains(last_child.getAttribute('data-class')) == true){
                var text = firstChild.textContent;
                var clientHeight = (maxHeight - childrenHeight);
                if(firstChild.classList.contains('dialogue')){
                    var total_lines = wrapText(text, 38);
                }else{
                    var total_lines = wrapText(text, 61);
                }
                var total_space = clientHeight / lineHeight;
                ////////////////////////console.log('clientHeight: ' + clientHeight);
                ////////////////////////console.log('total_lines: ' + total_lines);
                ////////////////////////console.log(total_lines);
                ////////////////////////console.log('total_space: ' + total_space);
                if(firstChild.classList.contains('dialogue')){
                    var newText = text.substr(0, (38 * total_space));
                    last_child.textContent = last_child.textContent + newText;

                    var newTextKeep = text.substr((38 * total_space), text.length);
                }else{
                    var newText = text.substr(0, (38 * total_space));
                    last_child.textContent = last_child.textContent + newText;

                    var newTextKeep = text.substr((38 * total_space), text.length);
                }
                
                //var randomStringClass = randomString(8);
                if(newTextKeep == ''){
                    firstChild.remove();
                }else{
                    firstChild.textContent = newTextKeep;
                }
            }else{
                let backup = firstChild.cloneNode(true);
                firstChild.remove();
                page.appendChild(backup);
            }*/

        /*}else if(pages.item(i + 1)){
            ////console.log('OKAY 2');
            //////////console.log('HMM2');
            //////////////////////console.log('TYPING_LAST');
            let last_offset = getSelection().anchorOffset;
            //////////console.log(last_offset);
            let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
            if(selection == null){
                selection = getSelection().anchorNode;
            }
            var next_page = pages.item(i + 1).childNodes[0];
            let firstChild = next_page.children[0];
            let last_child = page.lastChild;
            var l_text = last_child.textContent;
            if(last_child === selection) {
                if(firstChild.classList.contains(last_child.getAttribute('data-class')) == true){
                    if(last_child.classList.contains('dialogue')){
                        var total_lines = wrapText(l_text, 61);
                    }else{
                        var total_lines = wrapText(l_text, 61);
                    }
                    var last_line = total_lines[(total_lines.length - 1)];
                    var last_line_length = last_line.length;
                    if(last_child.classList.contains('dialogue')){
                        if(last_line_length > 61){
                            var text = firstChild.textContent;
                            var newText = text.substr(0, (61 - last_line_length));
                            last_child.textContent = last_child.textContent + newText;
                            if(last_offset > 0){
                                setCaret(last_child.childNodes[0], last_offset);
                            }
    
                            var newTextKeep = text.substr((61 - last_line_length), text.length);
                            if(newTextKeep == ''){
                                firstChild.remove();
                            }else{
                                firstChild.textContent = newTextKeep;
                            }
                        }
                    }else{
                        if(last_line_length < 61){
                            var text = firstChild.textContent;
                            var newText = text.substr(0, (61 - last_line_length));
                            last_child.textContent = last_child.textContent + newText;
                            if(last_offset > 0){
                                setCaret(last_child.childNodes[0], last_offset);
                            }
    
                            var newTextKeep = text.substr((61 - last_line_length), text.length);
                            if(newTextKeep == ''){
                                firstChild.remove();
                            }else{
                                firstChild.textContent = newTextKeep;
                            }
                        }
                    }
                    

                    ////////////////////////console.log('l_total_lines: ' + l_total_lines);
                    ////////////////////////console.log(l_total_lines);
                    ////////////////////////console.log('last_line: ' + last_line);
                    ////////////////////////console.log(last_line);
                    ////////////////////////console.log('last_line_length: ' + last_line_length);
                }
            }else{
                //////////console.log('HMM3');
                if(firstChild.classList.contains(last_child.getAttribute('data-class')) == true){
                    var text = last_child.textContent;
                    var clientHeight = (childrenHeight - maxHeight);
                    if(last_child.classList.contains('dialogue')){
                        var total_lines = wrapText(text, 38);
                    }else{
                        var total_lines = wrapText(text, 61);
                    }
                    var total_overflow = clientHeight / lineHeight;
                    var total_keep = (total_lines.length - total_overflow).toFixed();
                    var total_keep2 = total_keep - total_lines.length;
                    var text2 = firstChild.textContent;
                    if(last_child.classList.contains('dialogue')){
                        var newText = text2.substr(0, (38 * total_keep2));
                        last_child.textContent = text + newText;

                        var newTextKeep = text2.substr((38 * total_keep2), text2.length);
                    }else{
                        var newText = text2.substr(0, (61 * total_keep2));
                        last_child.textContent = text + newText;

                        var newTextKeep = text2.substr((61 * total_keep2), text2.length);
                    }
                    
                    if(newTextKeep == ''){
                        firstChild.remove();
                    }else{
                        firstChild.textContent = newTextKeep;
                    }
                    //////////console.log(selection);
                    setCaret(selection.childNodes[0], last_offset);

                    ////////////////////////console.log('clientHeight: ' + clientHeight);
                    ////////////////////////console.log('total_lines: ' + total_lines);
                    ////////////////////////console.log(total_lines);
                    ////////////////////////console.log('total_overflow: ' + total_overflow);
                    ////////////////////////console.log('total_keep: ' + total_keep);
                    ////////////////////////console.log('total_keep2: ' + total_keep2);

                }
                
            }*/
        //}
      
    }
                    // debuging start
  /*
                     console.log("last_child_length" + last_child_length);
                  
                     console.log("total_lines" + total_lines );
                     console.log("last_child_height" + last_child_height);
                     console.log("extra_height" + extra_height);
                     console.log("line_height" + line_height);
                     console.log("total_extra_lines" + total_extra_lines);
                     console.log("total_keep_lines" + total_keep_lines);
  */
                     // debuging end
    setPageno();
    setCharacterMargin();
    resizePages(Number($('#resizeBtn').children('span').attr('data-size')));
    setTimeout(function(){
        let last_offset = getSelection().anchorOffset;
	var sel = window.getSelection();
	let selection;
	if(sel && sel.rangeCount > 0){
             selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');        
	}else{
		console.log('sel not exist or smaller than 1');
		selection = null;
	}        
	if(selection == null){
            selection = getSelection().anchorNode;
        }
        clean_p(selection);
    }, 0);
    setTimeout(function(){
        resizePages(Number($('#resizeBtn').children('span').attr('data-size')));
    }, 50);
});

function clean_p(selection){
    //console.log('clean_p');
    var content_p = $('.content_p');
    //console.log(content_p.length);
    for (let index = 0; index < content_p.length; index++) {

        if(content_p.eq(index).hasClass('sceneheading') || content_p.eq(index).hasClass('dialogue')){
            /*console.log('w');
            console.log(content_p.eq(index).html());
            console.log(content_p.eq(index).children().eq(0).html());
            console.log('r');*/
            /*if(content_p.eq(index).html() == ''){

            }else if(content_p.eq(index).children().eq(0).html() == ''){
                
            }*/
            if(content_p.eq(index).children().eq(0).get(0) && content_p.eq(index).children().eq(0).get(0).nodeName == 'BR' && content_p.eq(index).html() == ''){
                content_p.eq(index).remove();
            }else if(content_p.eq(index).children().eq(0).get(0) && content_p.eq(index).children().eq(0).get(0).nodeName == 'SPAN' && content_p.eq(index).children().eq(0).html() == ''){
                content_p.eq(index).remove();
            }else if(content_p.eq(index).html() == ''){
                content_p.eq(index).remove();
            };
          
            /*if(content_p.eq(index).children().eq(0).html() == '' && content_p.eq(index).html() != ''){
                //console.log('h');
                //console.log(content_p.eq(index));
                //console.log(content_p.eq(index).html());
                //console.log('h');
                //console.log(selection);
                if(content_p.eq(index).get(0) != selection){
                    console.log('HMMMM');
                }

                /*if(content_p.eq(index).hasClass('sceneheading')){
                    var c_content = content_p.eq(index).parent();
                    var c_page = content_p.eq(index).parent().parent();
                    var wrap = content_p.eq(index).parent().parent();

                    if(wrap.children().length == 1 && Number(c_page.attr('pageno')) == 1 && c_content.children().length == 2 && c_content.children().eq(0).hasClass('scenenumber')){
                        console.log('LOOOOL');
                    }else{
                        content_p.eq(index).remove();
                    }
                    console.log('wrap_total: ', wrap.children().length);
                    console.log('c_page: ', c_page.attr('pageno'));
                }*/

                //console.log(content_p.eq(index));
                //content_p.eq(index).remove();
            //}
        }else{
            if(content_p.eq(index).html() == ''){
                //console.log('h');
                //console.log(content_p.eq(index));
                //console.log(content_p.eq(index).html());
                //console.log('h');
                content_p.eq(index).remove();
            }
        }
        
        
        
    }
}
console.log("good tel now2");
function sceneheading(){
    editor.focus();
    //restoreSelection();
    let last_offset = getSelection().anchorOffset;
    let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
    if(selection == null){
        selection = getSelection().anchorNode;
    }
    ////////////////////console.log("SN: " + selection.classList);
    ////////////////////console.log("last_offset: " + last_offset);
    ////////////////////console.log(selection);
    if(selection.classList.contains('sceneheading') == false){
        ////////////////////console.log('SN');
        selection.className = '';
        selection.removeAttribute('data-class');
        selection.classList.add('content_p');
        selection.classList.add('sceneheading');
        

        var span = document.createElement('span');
        span.classList.add('sceneheading-content');
        if(selection.textContent == ''){
            span.innerHTML = '<br>';
        }else{
            span.textContent = selection.textContent;
        }
        
        //selection.outerHTML = selection.outerHTML.replace(/p/g, "div");
        selection.innerHTML = '';
        selection.appendChild(span);

        var scene_number = document.createElement('p');
        scene_number.classList.add('scenenumber');
        scene_number.setAttribute('contenteditable', false);
        scene_number.innerHTML = 1;

        selection.parentNode.insertBefore(scene_number, selection);


        /*var div = document.createElement('div');
        div.classList.add('content_div');
        div.classList.add('sceneheading');
        div.innerHTML += '<div class="ceneheading-number" contenteditable="false">1</div>';
        var content = document.createElement('p');
        content.classList.add('sceneheading-content');
        if(selection.textContent == ''){
            content.innerHTML = '<br>';
        }else{
            content.textContent = selection.textContent;
        }
        div.appendChild(content);
        selection.parentNode.insertBefore(div, selection.nextSibling);
        selection.remove();*/



        if(lang == 1){
            $('#options_selection').children('span').html('Scene Heading');
        }else if(lang == 2){
            $('#options_selection').children('span').html(' مشه');
        }
        

        setScenenumber();

        setCaret(selection.childNodes[0].childNodes[0], last_offset);
        editor.dispatchEvent(new Event('input', {bubbles:true}));

    }

    $('.list_button button.active').removeClass('active');
    $('.select_option').fadeOut(200);

    
}

function setScenenumber(){
    var sceneheadings = $('.sceneheading');
    $('.scenenumber').remove();
    for (let index = 0; index < sceneheadings.length; index++) {
        sceneheadings.eq(index).attr('scenestr', (index + 1));
        sceneheadings.eq(index).attr('scenenumber', (index + 1));
        //////console.log();
        if(sceneheadings.eq(index).prev().hasClass('scenenumber') == false){
            //////console.log(sceneheadings.eq(index).prev());
            //if()
            sceneheadings.eq(index).before('<p class="scenenumber" contenteditable="false">'+(index + 1)+'</p>');
            
            //setScenenumber();
            //saveProjects();
        }
        $('.scenenumber').eq(index).html((index + 1));

    }

}

function action(){
    setTimeout(function(){
        editor.focus();
    }, 0)
    //restoreSelection();
    let last_offset = getSelection().anchorOffset;
    //////////console.log(getSelection());
    var sel = window.getSelection();
	let selection;
    if(sel && sel.rangeCount > 0){
	    selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
	}else{
		console.log('sel not exist or smaller than 1');
		selection = null;
		console.log(selection);
	}
    if(selection == null){
        selection = getSelection().anchorNode;
    }
    else if(selection.previousSibling && selection.previousSibling.classList.contains('scenenumber')){
        selection.previousSibling.remove();
    }
    ////////////////////console.log(selection);
    else if(selection.classList.contains('action') == false){
        selection.removeAttribute('scenestr');
        selection.removeAttribute('scenenumber');
        selection.removeAttribute('dialoguenumber');
        selection.removeAttribute('data-class');
        selection.className = '';
        selection.classList.add('content_p');
        selection.classList.add('action');
        
        if(selection.textContent == ''){
            selection.innerHTML = '<br>';
        }else{
            selection.textContent = selection.textContent;
        }
        
        if(lang == 1){
            $('#options_selection').children('span').html('Action');
        }else if(lang == 2){
            $('#options_selection').children('span').html('ح');
        }

        setCaret(selection.childNodes[0], last_offset);
        editor.dispatchEvent(new Event('input', {bubbles:true}));
    }
    
    $('.list_button button.active').removeClass('active');
    $('.select_option').fadeOut(200);
}


function character(){
    editor.focus();
    //restoreSelection();
    let last_offset = getSelection().anchorOffset;
    let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
    if(selection == null){
        selection = getSelection().anchorNode;
    }
    if(selection.previousSibling && selection.previousSibling.classList.contains('scenenumber')){
        selection.previousSibling.remove();
    }
    ////////////////////console.log(selection);
    if(selection.classList.contains('character') == false){
        selection.removeAttribute('scenestr');
        selection.removeAttribute('scenenumber');
        selection.removeAttribute('dialoguenumber');
        selection.removeAttribute('data-class');
        selection.className = '';
        selection.classList.add('content_p');
        selection.classList.add('character');
        
        if(selection.textContent == ''){
            selection.innerHTML = '<br>';
        }else{
            selection.textContent = selection.textContent;
        }
        
        if(lang == 1){
            $('#options_selection').children('span').html('Character');
        }else if(lang == 2){
            $('#options_selection').children('span').html('خص');
        }

        setCaret(selection.childNodes[0], last_offset);
        editor.dispatchEvent(new Event('input', {bubbles:true}));
    }
    

    $('.list_button button.active').removeClass('active');
    $('.select_option').fadeOut(200);
}

function dialogue(){
    editor.focus();
    //restoreSelection();
    let last_offset = getSelection().anchorOffset;
    let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
    if(selection == null){
        selection = getSelection().anchorNode;
    }
    if(selection.previousSibling && selection.previousSibling.classList.contains('scenenumber')){
        selection.previousSibling.remove();
    }
    ////////////////////console.log(selection);
    if(selection.classList.contains('dialogue') == false){
        selection.removeAttribute('scenestr');
        selection.removeAttribute('scenenumber');
        selection.removeAttribute('dialoguenumber');
        selection.removeAttribute('data-class');
        selection.className = '';
        selection.classList.add('content_p');
        selection.classList.add('dialogue');

        var span = document.createElement('span');
        span.classList.add('dialogue-content');
        if(selection.textContent == ''){
            span.innerHTML = '<br>';
        }else{
            span.textContent = selection.textContent;
        }
        
        selection.innerHTML = '';
        selection.appendChild(span);
        if(lang == 1){
            $('#options_selection').children('span').html('Dialogue');
        }else if(lang == 2){
            $('#options_selection').children('span').html('حو');
        }

        setDialoguenumber();

        setCaret(selection.childNodes[0].childNodes[0], last_offset);
        editor.dispatchEvent(new Event('input', {bubbles:true}));
    }

    $('.list_button button.active').removeClass('active');
    $('.select_option').fadeOut(200);
}

function setDialoguenumber(){
    var dialogues = $('.dialogue');
    for (let index = 0; index < dialogues.length; index++) {
        dialogues.eq(index).attr('dialoguenumber', (index + 1));
    }
}

function general(){
    editor.focus();
    //restoreSelection();
    let last_offset = getSelection().anchorOffset;
    let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
    if(selection == null){
        selection = getSelection().anchorNode;
    }
    if(selection.previousSibling && selection.previousSibling.classList.contains('scenenumber')){
        selection.previousSibling.remove();
    }
    ////////////////////console.log(selection);
    if(selection.classList.contains('general') == false){
        selection.removeAttribute('scenestr');
        selection.removeAttribute('scenenumber');
        selection.removeAttribute('dialoguenumber');
        selection.removeAttribute('data-class');
        selection.className = '';
        selection.classList.add('content_p');
        selection.classList.add('general');
        
        if(selection.textContent == ''){
            selection.innerHTML = '<br>';
        }else{
            selection.textContent = selection.textContent;
        }
        
        if(lang == 1){
            $('#options_selection').children('span').html('General');
        }else if(lang == 2){
            $('#options_selection').children('span').html('ع');
        }

        setCaret(selection.childNodes[0], last_offset);
        editor.dispatchEvent(new Event('input', {bubbles:true}));
    }
    

    $('.list_button button.active').removeClass('active');
    $('.select_option').fadeOut(200);
}

function checkSelectionOptions(){
    let last_offset = getSelection().anchorOffset;
    var sel = window.getSelection();
	let selection;
    if(sel && sel.rangeCount > 0 && getSelection().getRangeAt(0).startContainer.parentElement !== null){
	    selection  = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
	}else{
		console.log('sel not exist or smaller than 1');
		selection = null;
		console.log(selection);
	}
       console.log(selection, typeof selection);
    if(selection == null){
        selection = getSelection().anchorNode;
    }
    else if(selection.classList.contains('sceneheading')){
        if(lang == 1){
            $('#options_selection').children('span').html('Scene Heading');
        }else if(lang == 2){
            $('#options_selection').children('span').html('نو امش');
        }
    }else if(selection.classList.contains('action')){
        if(lang == 1){
            $('#options_selection').children('span').html('Action');
        }else if(lang == 2){
            $('#options_selection').children('span').html('ث');
        }
    }else if(selection.classList.contains('character')){
        if(lang == 1){
            $('#options_selection').children('span').html('Character');
        }else if(lang == 2){
            $('#options_selection').children('span').html('شخي');
        }
    }else if(selection.classList.contains('dialogue')){
        if(lang == 1){
            $('#options_selection').children('span').html('Dialogue');
        }else if(lang == 2){
            $('#options_selection').children('span').html('ار');
        }
    }else if(selection.classList.contains('general')){
        if(lang == 1){
            $('#options_selection').children('span').html('General');
        }else if(lang == 2){
            $('#options_selection').children('span').html('');
        }
    }
    
}




$('.list_button button').click(function(){
    if($(this).hasClass('active')){
        $('.list_button button.active').removeClass('active');
        $('.select_option').fadeOut(200);
    }else{
        $('.list_button button.active').removeClass('active');
        $(this).addClass('active');
        $('.select_option').fadeOut(200);
        $(this).parent().children('.select_option').fadeIn(200);
    }
});

$('#page_size li').click(function(){
    $(this).parent().parent().children('button').children('span').html(100 * Number($(this).attr('data-size')) + '%');
    resizePages($(this).attr('data-size'));
});

function resizePages(dataSize){

    //$('.page').css({webkitTransform: 'scale('+dataSize+')', transform: 'scale('+dataSize+')'});
    $('.select_option').fadeOut(200);
    $('.list_button button.active').removeClass('active');
    
    //////////////////////console.log(Number(dataSize));
    var dataSize = Number(dataSize);
    $('#resizeBtn span').html(100 * Number(dataSize) + '%');
    $('#resizeBtn span').attr('data-size', dataSize);
    //console.log(dataSize);
    if(dataSize == 0.50){
        var scale_value = 100;
        var type = 0;
    }else if(dataSize == 0.75){
        var scale_value = 33;
        var type = 0;
    }else if(dataSize == 1){
        var scale_value = 0;
        var type = 1;
    }else if(dataSize == 1.25){
        var scale_value = 20;
        var type = 1;
    }else if(dataSize == 1.50){
        var scale_value = 34;
        var type = 1;
    }else if(dataSize == 2){
        var scale_value = 51;
        var type = 1;
    };

    var page = $('.page');
    var total_height = 0;
    for (let index = 0; index < page.length; index++) {
        
        if(index == 0){
            page.eq(index).css({webkitTransform: 'scale('+dataSize+')', transform: 'scale('+dataSize+')'});
        }else{
          
          /*  if(type == 0){
               page.eq(index).css({webkitTransform: 'scale('+dataSize+') translateY(-'+(scale_value * (index))+'%)', transform: 'scale('+dataSize+') translateY(-'+(scale_value * (index))+'%)'});
            }else{
               page.eq(index).css({webkitTransform: 'scale('+dataSize+') translateY('+(scale_value * (index))+'%)', transform: 'scale('+dataSize+') translateY('+(scale_value * (index))+'%)'});
            }*/
          /////////
            if(dataSize == 2){
                document.querySelector(':root').style.setProperty('--margin-between-pages', 1250+'px');
            }else if(dataSize == 1.5){
              document.querySelector(':root').style.setProperty('--margin-between-pages', 680+'px');
            }else if(dataSize == 0.75){
              document.querySelector(':root').style.setProperty('--margin-between-pages', -200+'px');//-560
            }else if(dataSize == 0.5){
              document.querySelector(':root').style.setProperty('--margin-between-pages', -480+'px');//-560
            }else{
                document.querySelector(':root').style.setProperty('--margin-between-pages', 320-(1.25-dataSize)*1/0.25*284+'px');
            };
            
            //document.querySelector(':root').style.setProperty('--margin-between-pages', 320-(1.25-dataSize)*1/0.25*284+'px');
            //document.querySelector(':root').style.setProperty('--margin-between-pages',scale_value+'px');
            if(type == 0){
                page.eq(index).css({webkitTransform: 'scale('+dataSize+') translateY('+(scale_value * (index)*0)+'%)', transform: 'scale('+dataSize+') translateY('+(scale_value * (index)*0)+'%)'/*,height: ' + total_height + 'px + 30px)'*/});
            }else{
                page.eq(index).css({webkitTransform: 'scale('+dataSize+') translateY('+(scale_value * (index)*0)+'%)', transform: 'scale('+dataSize+') translateY('+(scale_value * (index)*0)+'%)'});
            };
            
        };
      

        //console.log(page.eq(index).get(0).getBoundingClientRect().height);
        total_height += page.eq(index).get(0).getBoundingClientRect().height;
        //total_height += page.eq(index).height();
    }
    
    $(editor).css({height: 'calc(' + total_height + 'px + 30px)'});
    //console.log(total_height);
  
}

$('#fullscreenBtn').click(function(){
    if($(this).hasClass('active')){
        $(this).removeClass('active');
        closeFullscreen()
    }else{
        $(this).addClass('active');
        openFullscreen();
    }
});
$(window).on('resize', function(){
    if(screen.height === window.innerHeight){
        $('#fullscreenBtn').addClass('active');
    }else{
        $('#fullscreenBtn').removeClass('active');
    }
});

var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen(){
    if(elem.requestFullscreen){
        elem.requestFullscreen();
    }else if(elem.webkitRequestFullscreen){ /* Safari */
        elem.webkitRequestFullscreen();
    }else if(elem.msRequestFullscreen){ /* IE11 */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen(){
    if(document.exitFullscreen){
        document.exitFullscreen();
    }else if(document.webkitExitFullscreen){ /* Safari */
        document.webkitExitFullscreen();
    }else if(document.msExitFullscreen){ /* IE11 */
        document.msExitFullscreen();
    }
}


/*var p1 = $('.page').eq(0).offset().top;
var h1 = $('.page').eq(0).height();
var t1 = p1 + h1;
//////////////////////console.log('p1: ' + p1);
//////////////////////console.log('h1: ' + h1);
//////////////////////console.log('t1: ' + t1);

var p2 = $('.page').eq(1).offset().top;
var h2 = $('.page').eq(1).height();
var t2 = p2 + h2;
//////////////////////console.log('p2: ' + p2);
//////////////////////console.log('h2: ' + h2);
//////////////////////console.log('t2: ' + t2);

document.getElementsByClassName('page')[0].getBoundingClientRect().height*/

//calc(-298px + 43px)

function saveProjects(id){
    $('body').blur();
    $('#saveBtn').get(0).style.setProperty('background', 'orange', 'important');
    if(lang == 1){
        $('#saveBtn').html('Saving').prop('disabled', true);
    }else if(lang == 2){
        $('#saveBtn').html('ري لظ').prop('disabled', true);
    }
    
    setTimeout(function(){
        
        var pages = {};
        pages[1] = $('.title_page').children('.title_content').html().trim();
        ////////////////console.log($('.title_page').children('.title_content').html().trim());
        for (let index = 0; index < $('.page').length; index++) {
            pages[index + 2] = $('.page').eq(index).children('.page_content').html();
        }
        //////////////console.log(pages);
        ////////////////////console.log(pages);
        //pages = JSON.stringify(pages);

        saving_data = $.ajax({
            url: "/core/projects.php?save_project_data=true&project_id=" + id,
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(pages),
            success: function(res){
                if(res.success == true){
                    $('#saveBtn').get(0).style.setProperty('background', 'green', 'important');
                    if(lang == 1){
                        $('#saveBtn').html('Saved');
                    }else if(lang == 2){
                        $('#saveBtn').html('م لظ');
                    }
                    
                }else if(res.success == false){
                    $('#saveBtn').get(0).style.setProperty('background', 'red', 'important');
                    if(lang == 1){
                        $('#saveBtn').html('Failed');
                    }else if(lang == 2){
                        $('#saveBtn').html('ف');
                    }
                    
                    setTimeout(function(){
                        $('#saveBtn').get(0).style.setProperty('background', '');
                        if(lang == 1){
                            $('#saveBtn').html('Save').prop('disabled', false);
                        }else if(lang == 2){
                            $('#saveBtn').html('ت اظ').prop('disabled', false);
                        }
                        
                    }, 2000);
                }else{

                }
            },
            error: function(){
                $('#saveBtn').get(0).style.setProperty('background', 'red', 'important');
                if(lang == 1){
                    $('#saveBtn').html('Failed');
                }else if(lang == 2){
                    $('#saveBtn').html('فش');
                }
                
                setTimeout(function(){
                    $('#saveBtn').get(0).style.setProperty('background', '');
                    if(lang == 1){
                        $('#saveBtn').html('Save').prop('disabled', false);
                    }else if(lang == 2){
                        $('#saveBtn').html(' حفظ').prop('disabled', false);
                    }
                    
                }, 2000);
            }
        });
    }, 50);
    

}

var old_title = null;
$(document).on('click', function (event) {
    if (!$(event.target).closest('.select_option').length) {
        if (!$(event.target).closest('.list_button button').length) {
            $('.select_option').fadeOut(200);
            $('.list_button button.active').removeClass('active');
        }
    }
    
    if (!$(event.target).closest('textarea.title_label').length) {
        $('textarea.active').parent().children('span').html($('textarea.active').val()).show();
        $('textarea.active').remove();
        height_before = null;
        $(event.target).closest('span.title_label').hide();
        var html = '<textarea name="" id="" class="title_label active" rows="1"  style="text-align: center; min-height:inherit" oninput="titleTexarea(this)">'+$(event.target).closest('span.title_label').text()+'</textarea>';
        $(event.target).closest('span.title_label').parent().append(html);
        $(event.target).closest('span.title_label').parent().children('textarea').focus();
        $(event.target).closest('span.title_label').parents('.short_span').find('textarea').attr({
            'maxlength': 25,
            'oninput' : "titleTexarea(this); this.value = this.value.replace(\/\\n\/g,\'\')"
        });


        if($('textarea.active').get(0)){
            titleTexarea($('textarea.active'));
            $('textarea.active').get(0).setSelectionRange($('textarea.active').get(0).value.length,$('textarea.active').get(0).value.length);
        }else{
            if(old_title != null && old_title != $('.title_page').children('.title_content').html().trim()){
                //$('#saveBtn').prop('disabled', false);
                //saveProjects(project_id);
                if(saving_timer != undefined){
                    clearTimeout(saving_timer);
                }
                saving_timer = setTimeout(function(){
                    saveProjects(project_id);
                }, 1000);
            }
            old_title = $('.title_page').children('.title_content').html().trim();
        }
    }
});

var height_before = null;
var last_total = null;
var first_total = null;
function titleTexarea(textarea){
    $('#saveBtn').get(0).style.setProperty('background', '');
    if(lang == 1){
        $('#saveBtn').prop('disabled', false).html('Save');
    }else if(lang == 2){
        $('#saveBtn').prop('disabled', false).html('ت الح');
    }
    
    var i = $(textarea).parent().index();
    var short_span = $(textarea).parent().hasClass('short_span');

    ////////console.log(i);
    if(short_span == true){
        var total_lines = wrapText($(textarea).val(), 30);
    }else{
        var total_lines = wrapText($(textarea).val(), 61);
    }
    if(total_lines.length == 0){
        $(textarea).css({height: '18px'});
    }
    //////////////console.log(total_lines);
    if(total_lines.length == 0){
        $(textarea).css({height: '18px'});
    }else{
        $(textarea).css({height: (total_lines.length * 17) + 'px'});
    }
    

    if(i == 0){
        if(height_before != $(textarea).height()){
            if(total_lines.length == 0 || total_lines.length == 1){
                $('.title_item').eq(1).css({marginTop: parseInt($('.title_item').eq(1).attr('data-top')) + 'px'});
                
            }
            if(height_before != null && height_before < $(textarea).height()){
                //////////////console.log('first');
                //var m = (parseInt($('.title_item').eq(1).attr('data-top')) - (total_lines.length * 17) + 17);
            }else{
                //////////////console.log('second');
                //var m = parseInt($('.title_item').eq(1).attr('data-top'))  (total_lines.length * 17);
            }
            if(parseInt($('.title_item').eq(1).css('margin-top')) <= 10){
                ////////////console.log($(textarea).height());
                if($(textarea).height() <= parseInt($('.title_item').eq(1).attr('data-top'))){
                    var m = (parseInt($('.title_item').eq(1).css('margin-top')) + 17);
                    if(m <= parseInt($('.title_item').eq(1).attr('data-top'))){
                        $('.title_item').eq(1).css({marginTop: m + 'px'});
                    }

                    
                    
                    
                }else{
                    
                }


                
            }else{
                if(height_before != null){
                    var m = (parseInt($('.title_item').eq(1).attr('data-top')) - (total_lines.length * 17) + 17);
                    if(m <= parseInt($('.title_item').eq(1).attr('data-top'))){
                        $('.title_item').eq(1).css({marginTop: m + 'px'});
                    }else{
                        $('.title_item').eq(1).css({marginTop: parseInt($('.title_item').eq(1).attr('data-top')) + 'px'});
                    }
                    
                }
            }
            if(total_lines.length == 0 || total_lines.length == 1){
                $('.title_item').eq(1).css({marginTop: parseInt($('.title_item').eq(1).attr('data-top')) + 'px'});
            }
        }
    }else if(i == 1){
        
    }
    if(height_before != $(textarea).height()){
        

        if($('.title_item').eq(0).outerHeight() + $('.title_item').eq(1).outerHeight() + parseInt($('.title_item').eq(1).css('margin-top')) > last_total){
            var m = (parseInt($('.title_item').eq(2).css('margin-top')) - 17);
            if(m >= 12){
                $('.title_item').eq(2).css({marginTop: m + 'px'});
                //if()
                    last_total = $('.title_item').eq(0).outerHeight() + $('.title_item').eq(1).outerHeight() + parseInt($('.title_item').eq(1).css('margin-top'));
                
            }

        }else{
            if(height_before != null && height_before > $(textarea).height()){
                if(i > 0 || $('.title_item').eq(0).height() >= parseInt($('.title_item').eq(1).attr('data-top'))){
                    var m = (parseInt($('.title_item').eq(2).css('margin-top')) + 17);
                    if(m <= parseInt($('.title_item').eq(2).attr('data-top'))){
                        $('.title_item').eq(2).css({marginTop: m + 'px'});
                            last_total = $('.title_item').eq(0).outerHeight() + $('.title_item').eq(1).outerHeight() + parseInt($('.title_item').eq(1).css('margin-top'));
                        
                        
                    }else{
                        $('.title_item').eq(2).css({marginTop: parseInt($('.title_item').eq(2).attr('data-top')) + 'px'});
                    }
                }
                
            }
        }

        if(total_lines.length == 0 || total_lines.length == 1){
            $('.title_item').eq(2).css({marginTop: parseInt($('.title_item').eq(2).attr('data-top')) + 'px'});
        }
    }
    height_before = $(textarea).height();
    

    /*
    
    ////////////////////console.log(total_lines.length);
    if(total_lines.length == 0){
        $(textarea).css({height: '18px'});
    }
    $(textarea).css({height: (total_lines.length * 17) + 1 + 'px'});

    ////////////////////console.log('index: ' + index);
    if(height_before != $(textarea).height()){
        ////////////////console.log("INSIDE");
        var title_field = $('.title_field');
        
        //////////////////console.log("SN");
        //////////////////console.log($(title_field).eq(3).position().top);
        //////////////////console.log($(title_field).eq(3).outerHeight());
        //////////////////console.log($(title_field).eq(4).position().top);
        //////////////////console.log("SN");
        

        //if(($(title_field).eq(3).position().top + $(title_field).eq(3).outerHeight()) >= ($(title_field).eq(4).position().top)){

            if(total_lines.length == 1){
                var total_height1 = 0;
                var total_height2 = 0;
            }else{
                if(height_before == null || $(textarea).height() > height_before){
                    if(total_lines.length == 0){
                        var total_height1 = 0;
                        var total_height2 = 0;
                    }else{
                        if(($(title_field).eq(3).position().top + $(title_field).eq(3).outerHeight()) >= ($(title_field).eq(4).position().top)){
                            var total_height1 = 17;
                            var total_height2 = 17;
                        }else{
                            var total_height1 = 0;
                            var total_height2 = 0;
                        }
                    }
                }else{
                    var total_height1 = 0;
                    var total_height2 = 0;
                }
            }

            ////////////////console.log(total_height2);

            var current_top1 = $(title_field).eq(4).attr('data-top');
            if($(title_field).eq(4).attr('data-second') != null && $(title_field).eq(4).attr('data-second') != undefined && $(title_field).eq(4).attr('data-second') != ''){
                var current_top_second1 = $(title_field).eq(4).attr('data-second');
                total_height1 = Number(current_top_second1) + total_height1;
            }
            if(height_before != null && $(textarea).height() < height_before){
                ////////////////console.log("FFFFFF");
                total_height1 = total_height1 - 17;
            }
            if(total_lines.length == 0){
                total_height1 = 0;
            }

            $(title_field).eq(4).css({top: 'calc(' + current_top1 + ' + ' + total_height1 + 'px)'});
            $(title_field).eq(4).attr('data-second', total_height1);

            
            var current_top2 = $(title_field).eq(5).attr('data-top');
            if($(title_field).eq(5).attr('data-second') != null && $(title_field).eq(5).attr('data-second') != undefined && $(title_field).eq(5).attr('data-second') != ''){
                var current_top_second1 = $(title_field).eq(5).attr('data-second');
                total_height2 = Number(current_top_second1) + total_height2;
            }
            if(height_before != null && $(textarea).height() < height_before){
                ////////////////console.log("FFFFFF");
                total_height2 = total_height2 - 17;
            }
            if(total_lines.length == 0){
                total_height2 = 0;
            }

            $(title_field).eq(5).css({top: 'calc(' + current_top2 + ' + ' + total_height2 + 'px)'});
            $(title_field).eq(5).attr('data-second', total_height2);
        

        for (let index = (i + 1); index < 4; index++) {
            
            //////////////////console.log($(title_field).eq(index).attr('data-second'));
            
            //////////////////console.log('current_top: ' + current_top);
            //var total_height = (total_lines.length * 17) - 17;
            if(total_lines.length == 1){
                var total_height = 0;
            }else{
                if(height_before == null || $(textarea).height() > height_before){
                    if(total_lines.length == 0){
                        var total_height = 0;
                    }else{
                        var total_height = 17;
                    }
                }else{
                    var total_height = 0;
                }
            }
            
            
            var current_top = $(title_field).eq(index).attr('data-top');
            if($(title_field).eq(index).attr('data-second') != null && $(title_field).eq(index).attr('data-second') != undefined && $(title_field).eq(index).attr('data-second') != ''){
                var current_top_second = $(title_field).eq(index).attr('data-second');
                total_height = Number(current_top_second) + total_height;
                
            }
            ////////////////console.log('');
            ////////////////console.log($(textarea).height());
            ////////////////console.log(height_before);
            ////////////////console.log(total_height);
            if(height_before != null && $(textarea).height() < height_before){
                ////////////////console.log("FFFFFF");
                total_height = total_height - 17;
            }
            if(total_lines.length == 0){
                total_height = 0;
            }
            ////////////////console.log(total_height);
            

            //////////////////console.log('total_height: ' + total_height);
            //////////////////console.log(' ');
            $(title_field).eq(index).css({top: 'calc(' + current_top + ' + ' + total_height + 'px)'});
            $(title_field).eq(index).attr('data-second', total_height);
            
        }
        //////////////////console.log(' ');
        //////////////////console.log(' ');
    }else{
        ////////////////console.log("OUTSIDE");
    }
    height_before = $(textarea).height();*/
        
}
//////////////////console.log(wrapText('1234567890123456789012345678901234567890123456789012345678901akhgfkhak\nlgla', 30));


function open_title_page(){
    $('.select_option').fadeOut(200);
    $('.list_button button.active').removeClass('active');
    $('.top-control-left').children('button').hide();
    $('.top-control-left').children('.list_button').hide();
    $('.top-control-left').children('.divider').hide();

    $('.top-control-left').children('#back_btn').show();
    $('.top-control-left').children('.divider').last().show();
    $('.top-control-left').children('#saveBtn').show();

    $('#title_editor').show();
    $('#editor').hide();
}

function close_title_page(){
    $('.top-control-left').children('button').show();
    $('.top-control-left').children('.list_button').show();
    $('.top-control-left').children('.divider').show();

    $('.top-control-left').children('#back_btn').hide();

    $('#title_editor').hide();
    $('#editor').show();
}


/*$('#downloadSelection li').click(function(){
    var dataItem = $(this).attr('data-item');
    ////////////console.log(dataItem);
    setCharacterMargin();
    if(dataItem == '1'){
        download('generate_pdf=true&type=title_page', this);
    }else if(dataItem == '2'){
        download('generate_pdf=true&type=script', this);
    }else if(dataItem == '3'){
        download('generate_pdf=true&type=title_page_script', this);
    }
    
    $('#editor').removeAttr('contenteditable');
    $('#downloadSelection').addClass('active');
    $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + $(this).text());

});*/

function setCharacterMargin(){
    var c = $('.page').children('.page_content').children('.character');
    for (let index = 0; index < c.length; index++) {
        //c.eq(index).next().css({marginBottom: '10px'});
        ////////////console.log(c.eq(index).next());
        if(c.eq(index).next().length > 0){
            if(c.eq(index).next().hasClass('dialogue') == true){
                //c.eq(index).get(0).style.setProperty('margin-bottom', '0', 'important');
                
                c.eq(index).next().get(0).style.setProperty('margin-bottom', '');
                c.eq(index).next().get(0).style.setProperty('margin-top', '0', 'important');
                c.eq(index).get(0).style.setProperty('margin-bottom', '0', 'important');
                /*if(c.eq(index).next().next().hasClass('general') == true){
                    c.eq(index).next().get(0).style.setProperty('margin-bottom', '0', 'important');
                    c.eq(index).next().next().get(0).style.setProperty('margin-top', '0', 'important');
                }*/
                //c.eq(index).next().get(0).style.setProperty('margin-bottom', '17px', 'important');
            }else if(c.eq(index).next().hasClass('general') == true){
                c.eq(index).get(0).style.setProperty('margin-bottom', '0', 'important');
                c.eq(index).next().get(0).style.setProperty('margin-top', '0', 'important');
                if(c.eq(index).next().next() && c.eq(index).next().next().hasClass('dialogue') == true){
                    c.eq(index).next().get(0).style.setProperty('margin-bottom', '0', 'important');
                    c.eq(index).next().next().get(0).style.setProperty('margin-top', '0', 'important');
                }
                //c.eq(index).next().get(0).style.setProperty('margin-bottom', '17px', 'important');
            }else{
                ////console.log(c.eq(index).next());
                c.eq(index).get(0).style.setProperty('margin-bottom', '');
                if(c.eq(index).next().length > 0){
                    c.eq(index).next().get(0).style.setProperty('margin-top', '');
                }
            }
        }
        
    }
}

function download(url, btn){
    var pages = {};
    pages[1] = $('.title_page').children('.title_content').html().trim();

    //newEditor.append($('.page'));
    //newEditor.children('.page').css({transform: '', webkitTransform: '', marginBottom: ''});
    ////////////////console.log($('.title_page').children('.title_content').html().trim());
    for (let index = 0; index < $('.page').length; index++) {
        pages[index + 2] = $('.page').eq(index).children('.page_content').html();
    }
    //////////////console.log(pages);
    console.log(pages);
    //pages = JSON.stringify(pages);

    saving_data = $.ajax({
        url: "/core/generate_pdf.php?" + url + '&project_name=' + project_name,
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(pages),
        success: function(res){
            $('#editor').attr('contenteditable', true);
            $('.download').show();
            $('.download_spinner').hide();
            $(btn).prop('disabled', false);
            //$('#downloadSelection').removeClass('active');
            if(res.success == true){
                if($('#new_link').length == 0){
                    var a = $('<a href="#" target="_blank" id="new_link" class="d-none">Open pdf in new tab</a>');
                    $('body').append(a);
                    
                }
                var a = $('#new_link');
                a.attr('href', '/pdf/' + res.url);
                setTimeout(function(){
                    $('#new_link').get(0).click();
                }, 1);
                

                //window.open('/pdf/' + res.url, '_blank').focus();
                //$(btn).children('span.spinner-border').remove();
                //$('.list_button button.active').removeClass('active');
                //$('.select_option').fadeOut(200);
            }else if(res.success == false){
                //$(btn).children('span.spinner-border').remove();
                //$('.list_button button.active').removeClass('active');
                //$('.select_option').fadeOut(200);
            }else{

            }
        },
        error: function(){
            $('#editor').attr('contenteditable', true);
            $('.download').show();
            $('.download_spinner').hide();
            $(btn).prop('disabled', false);
            //$('#downloadSelection').removeClass('active');
            //$(btn).children('span.spinner-border').remove();
            //$('.list_button button.active').removeClass('active');
            //$('.select_option').fadeOut(200);
        }
    });
};


$('#download').click(function(){
    $('.download').hide();
    $('.download_spinner').show();
    $(this).prop('disabled', true);
    download('generate_pdf=true&type=title_page_script', this);
});

function setTitleMargin(){
    $('#title_editor').css({
        visibility: 'hidden',
        position: 'fixed',
        zIndex: '-100'
    }).show();
    var title_item = $('.title_item');
    var previousMargin = 0;
    var allTop = [];
    var allHeight = [];
    for (let index = 0; index < title_item.length; index++) {
        var positionTop = $(title_item).eq(index).position().top;
        var height = $(title_item).eq(index).outerHeight();
        allTop.push(positionTop);
        allHeight.push(height);
        
    }

    for (let index = 0; index < allTop.length; index++) {
        //var positionTop = $(title_item).eq(index).position().top;
        
        ////////////console.log(allTop[index]);
        ////////////console.log(previousMargin);
        if(index > 0){
            ////////////console.log("SN");
            ////////////console.log($(title_item).eq(index));
            ////////////console.log('calc(' + allTop[index] + 'px - ' + previousMargin + 'px)');
            $(title_item).eq(index).css({marginTop: (allTop[index] - (previousMargin + 18)) + 'px', top: '0'}).attr('data-top', (allTop[index] - (previousMargin + 18)));
        }else{
            $(title_item).eq(index).css({marginTop: allTop[index] + 'px', top: '0'}).attr('data-top', allTop[index]);
        }
        previousMargin = allTop[index];
    }
    ////////////console.log('s');
    ////////////console.log($(title_item).eq(title_item.length - 2).css('marginTop'));
    last_total = $(title_item).eq(0).outerHeight() + $(title_item).eq(1).outerHeight() + parseInt($(title_item).eq(1).css('margin-top'));
    first_total = $(title_item).eq(0).outerHeight() + $(title_item).eq(1).outerHeight() + parseInt($(title_item).eq(1).css('margin-top'));
    ////////////console.log('last_total: ' + last_total);
    //$(title_item).last().css({marginTop: $(title_item).eq(title_item.length - 2).css('marginTop'), top: '0'});
    $('#title_editor').css({
        visibility: '',
        position: '',
        zIndex: ''
    }).hide();
}

function setPageno(){
    var pages = $('.page');
    for (let index = 0; index < pages.length; index++) {
        pages.eq(index).attr('pageno', (index + 1));
    }
}


/*var title_field = $('.title_field');
for (let index = 0; index < 1; index++) {
    $(title_field).eq(index + 1).css({top: ($(title_field).eq(index).position().top + $(title_field).eq(index).height()) + 'px'});
}

var title_field = $('.title_field');
for (let index = 0; index < 1; index++) {
    $(title_field).eq(index + 1).css({top: ($(title_field).eq(index).position().top + $(title_field).eq(index).height()) + 'px'});
}*/

/*$(document).on('copy', '#editor', function (e) {
    e = e.originalEvent;
    var selectedText = window.getSelection();
    ////////console.log("original copied text\n--------\n", selectedText.htmlText);
    //////////console.log("original copied text\n--------\n", selectedText.toString());
    var range = selectedText.getRangeAt(0);
    var selectedTextReplacement = range.toString()
    //////////console.log(selectedText);
    ////////////console.log("replacement in clipboard\n--------\n", selectedTextReplacement);
    e.clipboardData.setData('text/plain', selectedTextReplacement);
    e.preventDefault(); // default behaviour is to copy any selected text
});

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

alert(getSelectionHtml());*/

$(document).on('paste', '#editor', function (e) {
    e.preventDefault();

    var clipboardDataText = e.originalEvent.clipboardData.getData('text/plain');
    var clipboardData = e.originalEvent.clipboardData.getData('text/html');

    var newHtml = $(clipboardData);
    var index1 = 0;
    
    if(newHtml.get(0) && newHtml.get(0).tagName && newHtml.get(0).tagName == 'META'){
        newHtml.eq(0).remove();
        index1 = 1;
    }
    var pass = false;
    for (let index = index1; index < newHtml.length; index++) {
        var p = newHtml.eq(1).get(0);
        if(p && p.tagName && p.tagName == 'P' && p.classList.contains('content_p')){
            pass = true;
        }else{
            pass = false;
            break;
        }
    }
    if(pass == true){
        ////////console.log('TRUE');
        document.execCommand('insertHTML', false, clipboardData);
    }else{
        ////////console.log('FALSE');
        ////////console.log(clipboardDataText);
        document.execCommand('insertText', false, clipboardDataText.trim());
    }
    let selection = getSelection().getRangeAt(0).startContainer.parentElement.closest('p');
    if(selection == null){
        selection = getSelection().anchorNode;
    }
    
    var selected_page = selection.parentNode.parentNode;
    
    $('.dashboard_content').animate({
        scrollTop: (($('.dashboard_content').scrollTop() + ($(selected_page).offset().top - $('.dashboard_content').offset().top))) + selection.offsetTop
    });
});





window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';
    /*if(($('#saveBtn').prop('disabled') == false && $('#saveBtn').text() == 'Save') || ($('#saveBtn').text() == 'Saving')){
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }*/
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

/// solving the reverse text problem
/*
$('.page_content').on('DOMSubtreeModified', function(){
  $('.page_content').eq(0).eq(0).val($('.page_content').eq(0).eq(0).val().reverse());
});*/
