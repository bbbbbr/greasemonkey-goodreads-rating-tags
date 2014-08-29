// ==UserScript==
// @name        Goodreads tags to images
// @namespace   http://www.goodreads.com/*
// @description Converts selected tags on GoodReads into rating images (such as tags with half-star ratings)
// @include     /^https?://.*\.goodreads\.com/.*$/
// @grant       none
// @version     1.0.0
// ==/UserScript==



// TODO :
//
// * Handle ajax content loaded by Infinite Scroll mode on book list pages (but don't convert on tag dropdowns)
// * Make another attempt at using jquery without goodreads version conflict - load just within tamper/greasemonkey?

// TODO-MAYBE :
//
// * Consider making text removal optional
// * Improve hover background color



//
// Load tag image data into keyed hash
//
function initImageData()
{
    /*
    // GoodReads style stars
    tagImages['stars-on'  ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAUVBMVEUAAAD7m1iCXkfwl1WebUqlcEpVRETIgE64d0v+nlj8nFa2d0v4mVOwdUzkj1CZaEa/ekzTh1CucUmAYEhlVEb8m1X6mVPejFDNg03xllP0llFfj+n0AAAAFXRSTlMAQFCPjzAP7+/f39/Pz49/b0A/IDrp95/4AAAAbElEQVQI11XMWQ6AIAxF0YqA82wf6P4XKlAw4X7QnISWJGOoqm1rD0NFw2yq78xl4WhCI/MY56FocfznlptIe4jgNcVUh1SnSDrFJ+VW4HmAtXiGmyaHOfN6vbZW+/cS771KZ/tdvFmZdgvPB4/9Bmn/QwdxAAAAAElFTkSuQmCC" };
    tagImages['stars-half']  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAilBMVEUAAADc3Nz7m1jslFTIyMjc3Nz9nVfY2Ni9vb2ebUq1tbWEX0fIyMjAwMClcEqnp6dVRETIgE64d0vExMS2d0vZ2dnDw8P4mVOwdUzT09O7u7uZaEbHx8e/ekyysrLTh1CucUmsrKy0tLSAYEjb29v8m1X6mVPZ2dnY2NjR0dHMzMzzllLejFDNg00dOFS2AAAAJHRSTlMAQECP79/fj4+PT08/MDAPD+/v39/Pz8/Pj39/b29XQD86ICBFgkJ2AAAAe0lEQVQI11XM1w6DMAxAUbcFyobuyU7ssP7/90hkQMp9iHWk2MClCVidzrY912IqRWJ9l2JbqI46Twr3oItLeE/SJEz9swEIZmTT4IMpuiAiETkhcDU73q8jjoros/mF0/3Wq8fKbpyDPPMH1bKLa2RG6PzZv5xn9tXPAm2HCyy7k3wtAAAAAElFTkSuQmCC" };
    tagImages['stars-off' ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAZlBMVEUAAABRUVGnp6dPT09dXV3Z2dm+vr7c3NympqaWlpagoKCDg4PIyMioqKiSkpJ/f39paWl8fHxxcXGWlpZQUFBMTEze3t7Q0NDd3d3IyMjY2NjW1taWlpbDw8O4uLi1tbWkpKSVlZWzvvflAAAAFnRSTlMAP08wD+/v39/fz8+Pj4+Pj39vPyBXxSPejwAAAHhJREFUCNdVzEcChCAMQNEI2HuZSQLY7n9JxeiCv4C8RQKS1hA1DLHLMqLe92ihZ+5BSkIFYvEMP6hP74/V2vXw/qwTgJYZHZFD5hZCKqX/HaUKpNkG2xneOgzG7nOFlOeE1ctlc40xjdsW8ZSp52w2iUcjvxnv5wL9swc1kspz8wAAAABJRU5ErkJggg==" };
    */

    // Readinglist style stars
    tagImages['stars-on'  ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAArlBMVEUAAACZhA2SfAeTfQiWgAqjjhSbhhCZhA6VfwmTfQiSfAe/qiG8pBq+qCG1oyOXgQyqlx2ZhA2ahQ6Ygg2SfAeSfAfFrh/DsS+ahg+1pCuznhuwmxqXggyahQ+ahQ+bhhCahQ+WgAuSfAeSfAeSfAeSfAeSfAeSfAf93SD92xz83yv82yDz0x741Rf95Dnawyvz0Bbw3UTo1D3izz333TPgyC/y1ijjySb21yH62BsxGQzCAAAAKHRSTlMA9Rr9+PDNpoqECvr49/Pw7+axmjkW/vvz8vLx7tXFwruRXEdELyACk7+DAAAAAJFJREFUCNdtj1cOgzAQRE0zjuktvVdXID25/8ViAkRBYn92nrR62gH9Yw86eDIWHd764+M/LwsHtVnX9dQUz+iggsK5pmmWWwrXUgECgMzLQ5RScpaPguo+i5yXfFPC/BX+CnA8pJSSadIa1wUhnHu/l4z8NvPYHTa4D68msq2zgWtOJjADIA3CXdNlU++4EnwAIugKeWWWGPcAAAAASUVORK5CYII=" };
    tagImages['stars-half']  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAtFBMVEUAAACwsLCwsLCwsLCWgAqZhA2wsLCwsLCSfAeTfAe1oyewsLCwsLCwsLCwsLCZgw2wsLCVfwmwsLCwsLCSfAewsLDFrh+/qiK9pBiwsLCwmxqplhykjxSXggyYgw2wsLCbhhCahQ+ahQ+ahQ+ZhA6wsLCWgAuwsLCSfAeSfAeSfAewsLCwsLCwsLCSfAf93B754DXy0h/10hbo1D3izz3bxC3YwSry1ij21yH62Bv41hjyzxbr3p9MAAAAL3RSTlMA5pMa+PWjgxr98tTHvLaeiYlFJBYG/vr6+PHv7+7n4M/Fu7Spm5GMXEQ7OC8NCqlfTewAAACKSURBVAjXbcxVDsMwEEXRZzt2HGywzMyBcrv/fVVWHKmRej9m5vwM/rc0m7bcBrf2JP717L4J6ltKuTeK2DkyxgCMOOfD7gfUIYR4QGhcHkVZAkBA1EzGnef7BaTCP0F1XrSzDBAUuvlNmZq1rTzvU0Se5m5wNcKVy3pp5ZY9TYAD8SPtdbWFevAFqBcJHezWuyEAAAAASUVORK5CYII=" };
    tagImages['stars-off' ]  = { imgData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAVFBMVEUAAACwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLDhRk/qAAAAHHRSTlMA5hqTo4yIg/rvxry2m0MlDQbd1K2nV0g5Fr8vhYZdwQAAAHRJREFUCNdtjkkShCAMRT8EUBAUnO2+/z07QGtplX+RvLfIgPeE5umte+iqxuHuftPmZCnlbjFMXwZWwXEaoImhA4y9Jo3I9Rh1saR8LBCXcnwh/DOvuVJzPZPiTOi7agy9NcHJNlUn9TmAXfitetC1q7zgB1YDA4NW818dAAAAAElFTkSuQmCC" };


    // Readinglist style clouds
    tagImages['clouds-on'  ] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAVHYCaOZEkOjDgMprq+AyKZBLwWjmnDy7jbhonrt2JgRBDF4aB4NBKFBIQiHFUul8pkYsFYZq0wKTIWkcuj89m0FmfabXFcFAIAOw==" };
    tagImages['clouds-half'] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAVEYCaOZEkOjCgIpji8bxCsJgEPQM6WN57Po94r99sJfcQdRHE4KB4NIgA4qlwulclq2+qWIqTdbgQmq7plryidGavZoxAAOw==" };
    tagImages['clouds-off' ] = { imgData: "data:image/gif;base64,R0lGODlhDwAPAMQAAP///9XV1bi4uJ6enp2dnZycnJqampmZmZSUlJKSko6OjoiIiIaGhoSEhIODg4KCgoGBgYCAgHFxcXBwcG5ubm1tbWxsbGpqamlpaf///wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABkALAAAAAAPAA8AAAU0YCaOZEkKgoiaahCg7loKQG0D6Xzb7wjvvBwNeBMKAkRAz4dqOlnQ2Ukl9VFZueh1q82SQgA7" };
}


//
// Append an <img> tag with the given image data to an element
//
function appendImage(parentObj, imgData)
{
    var tagImg     = document.createElement('img');
        tagImg.src = imgData;
    parentObj.appendChild(tagImg);
}


//
// Prepend an <img> tag with the given image data to an element (via modifying it's html)
//
function prependImage(parentObj, imgData)
{
    parentObj.innerHTML = "<img src=" + imgData + " alt=''/>" + parentObj.innerHTML;
}


//
// Render a tag rating based on a type ("stars","clouds) and a numeric value in tag format ("4-0","1-5", etc)
//
function renderTagImages(parentObj, imgType, imgValue)
{
    var valMax = 5.0;
    var valOn  = parseFloat( imgValue.replace("-", ".") );
    var valOff = valMax - valOn;

    if ((imgType == "stars") || (imgType == "clouds"))
    {
        // Render whole "on" icons first
        while (valOn > 0.5) {
            appendImage(parentObj, tagImages[ imgType + '-on' ].imgData );
            valOn -= 1.0;
        }

        // Render half "on" icon if needed for 0.5 values
        if (valOn == 0.5) {
            appendImage(parentObj, tagImages[ imgType + '-half' ].imgData );
        }

        // Render the remaining slots as placeholders ("off")
        while (valOff >= 1) {
            appendImage(parentObj, tagImages[ imgType + '-off' ].imgData );
            valOff -= 1.0;
        }
    }
}


//
//  Find links with matching tag text and convert them to the paired images
//  (non-jquery version to avoid GoodReads breakage with jquery version conflict)
//
function convertTagsToImages()
{
    var myRegexp = /rating-(stars|clouds)-(\d-\d)/;
    var objText;
    var elAnchor;
    var elLinks = document.getElementsByTagName( 'a' );

    // Walk through all the anchor tags on the page
    for ( var i = 0; i < elLinks.length; i++ ) {

        elAnchor = elLinks[ i ];

        var match = myRegexp.exec(elAnchor.text);
        // Note : match[0] = full match text, [1] = "stars" or "clouds", [2] = "N1-N2" where (ideally) N1 is a digit 0-9 and N2 is 0 or 5
        if (match != null) {

            // Strip out tag name and save off any trailing text (trailing text gets re-appended later)
            objText = elAnchor.text.replace(match[0], "");
            // Remove tag text temporarily
            elAnchor.innerHTML = "";

            // Render tag image
            renderTagImages(elAnchor, match[1], match[2]);

            // prevent line breaks
            elAnchor.style.whiteSpace="nowrap";

            // Restore trailing text
            elAnchor.innerHTML = elAnchor.innerHTML + objText;
        }
    }
}


var tagImages = Object.create(null);  // Hash for storing tag image data by key name

initImageData();
convertTagsToImages();
