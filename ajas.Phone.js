/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 * The way I want to do phones (Apr 11, 2007) rev. (Apr 20, 2007)
 * If you find an error, or improvement, let me know: dev at ajas dot us
 *
 * ajas.Phone.magic()           - call this onblur, scrubs and validates
 * ajas.Phone.validate()- call for true/false validation
 * ajas.Phone.parse()   - don't call this
 * ajas.Phone.areaCodes - listing of area codes and related info
 *                     found at: http://www.bennetyee.org/ucsd-pages/area.html
 *
 * The function cancelBubble() is found in ajas.event.js
 *****************************************************************************/
if("undefined" == typeof(ajas))ajas={"Phone":{}};
ajas.Phone=ajas.Phone?ajas.Phone:{};


// use this function for form feedback
ajas.Phone.magic=function(oInput, bStrict, bWordy) {
    // Set preferred defaults here.
    // bStrict=true will do some advanced checking on the area code
    if(arguments.length < 2) var bStrict=true;
    // bWordy allows dialpad letters
    if(arguments.length < 3) var bWordy=true;

    var sLabel = oInput.id + 'Msg';
    oInput.className = oInput.className.replace(/ajas_phone_email/g, '');
    try {
        if (oInput.value == '') {
            ajas._e(sLabel).innerHTML = '###-###-####';
            return;
        }
        var sPhone = ajas.Phone.parse(oInput.value, bStrict, bWordy);
        // Human readable phone
        ajas._e(sLabel).innerHTML = oInput.value = sPhone;
    } catch (e) {
        oInput.className += ' ajas_phone_email';
        var message = e.message;
        // Fix for IE6 bug
        if (message.indexOf('is null or not an object') > -1) {
            message = 'Invalid Phone string';
        }
        ajas._e(sLabel).innerHTML = message;
    }

};

//http://www.bennetyee.org/ucsd-pages/area.html
ajas.Phone.areaCodes={
    '52' :{'Region':'MX','dst':true,'time':'-6','desc':'Mexico: Mexico City area (country code + city code)'},
    '55' :{'Region':'MX','dst':true,'time':'-6','desc':'Mexico: Mexico City area (country code + city code)'},
    '201':{'Region':'NJ','dst':true,'time':'-5','desc':'N New Jersey: Jersey City, Hackensack (see split 973, overlay 551)'},
    '202':{'Region':'DC','dst':true,'time':'-5','desc':'Washington, D.C.'},
    '203':{'Region':'CT','dst':true,'time':'-5','desc':'Connecticut: Fairfield County and New Haven County; Bridgeport, New Haven (see 860)'},
    '204':{'Region':'MB','dst':true,'time':'-6','desc':'Canada: Manitoba'},
    '205':{'Region':'AL','dst':true,'time':'-6','desc':'Central Alabama (including Birmingham; excludes the southeastern corner of Alabama and the deep south; see splits 256 and 334)'},
    '206':{'Region':'WA','dst':true,'time':'-8','desc':'W Washington state: Seattle and Bainbridge Island (see splits 253, 360, 425; overlay 564)'},
    '207':{'Region':'ME','dst':true,'time':'-5','desc':'Maine'},
    '208':{'Region':'ID','dst':true,'time':'-7/-8','desc':'Idaho'},
    '209':{'Region':'CA','dst':true,'time':'-8','desc':'Cent. California: Stockton (see split 559)'},
    '210':{'Region':'TX','dst':true,'time':'-6','desc':'S Texas: San Antonio (see also splits 830, 956)'},
    '211':{'Region':null,'dst':null,'time':null,'desc':'Local community info / referral services'},
    '212':{'Region':'NY','dst':true,'time':'-5','desc':'New York City, New York (Manhattan; see 646, 718)'},
    '213':{'Region':'CA','dst':true,'time':'-8','desc':'S California: Los Angeles (see 310, 323, 626, 818)'},
    '214':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: Dallas Metro (overlays 469/972)'},
    '215':{'Region':'PA','dst':true,'time':'-5','desc':'SE Pennsylvania: Philadelphia (see overlays 267)'},
    '216':{'Region':'OH','dst':true,'time':'-5','desc':'Cleveland (see splits 330, 440)'},
    '217':{'Region':'IL','dst':true,'time':'-6','desc':'Cent. Illinois: Springfield'},
    '218':{'Region':'MN','dst':true,'time':'-6','desc':'N Minnesota: Duluth'},
    '219':{'Region':'IN','dst':true,'time':'-6/-5','desc':'NW Indiana: Gary (see split 574, 260)'},
    '224':{'Region':'IL','dst':true,'time':'-6','desc':'Northern NE Illinois: Evanston, Waukegan, Northbrook (overlay on 847, eff 1/5/02)'},
    '225':{'Region':'LA','dst':true,'time':'-6','desc':'Louisiana: Baton Rouge, New Roads, Donaldsonville, Albany, Gonzales, Greensburg, Plaquemine, Vacherie (split from 504)'},
    '226':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: SW Ontario: Windsor (overlaid on 519; eff 6/06)'},
    '228':{'Region':'MS','dst':true,'time':'-6','desc':'S Mississippi (coastal areas, Biloxi, Gulfport; split from 601)'},
    '229':{'Region':'GA','dst':true,'time':'-5','desc':'SW Georgia: Albany (split from 912; see also 478; perm 8/1/00)'},
    '231':{'Region':'MI','dst':true,'time':'-5','desc':'W Michigan: Northwestern portion of lower Peninsula; Traverse City, Muskegon, Cheboygan, Alanson'},
    '234':{'Region':'OH','dst':true,'time':'-5','desc':'NE Ohio: Canton, Akron (overlaid on 330; perm 10/30/00)'},
    '236':{'Region':'VA','dst':true,'time':'-5','desc':'Virginia (region unknown) / Unassigned?'},
    '239':{'Region':'FL','dst':true,'time':'-5','desc':'Florida (Lee, Collier, and Monroe Counties, excl the Keys; see 305; eff 3/11/02; mand 3/11/03)'},
    '240':{'Region':'MD','dst':true,'time':'-5','desc':'W Maryland: Silver Spring, Frederick, Gaithersburg (overlay, see 301)'},
    '242':{'Region':null,'dst':true,'time':'-5','desc':'Bahamas'},
    '246':{'Region':null,'dst':true,'time':'-4','desc':'Barbados'},
    '248':{'Region':'MI','dst':true,'time':'-5','desc':'Michigan: Oakland County, Pontiac (split from 810; see overlay 947)'},
    '250':{'Region':'BC','dst':true,'time':'-8/-7','desc':'Canada: British Columbia (see 604)'},
    '251':{'Region':'AL','dst':true,'time':'-6','desc':'S Alabama: Mobile and coastal areas, Jackson, Evergreen, Monroeville (split from 334, eff 6/18/01; see also 205, 256)'},
    '252':{'Region':'NC','dst':true,'time':'-5','desc':'E North Carolina (Rocky Mount; split from 919)'},
    '253':{'Region':'WA','dst':true,'time':'-8','desc':'Washington: South Tier - Tacoma, Federal Way (split from 206, see also 425; overlay 564)'},
    '254':{'Region':'TX','dst':true,'time':'-6','desc':'Central Texas (Waco, Stephenville; split, see 817, 940)'},
    '256':{'Region':'AL','dst':true,'time':'-6','desc':'E and N Alabama (Huntsville, Florence, Gadsden; split from 205; see also 334)'},
    '260':{'Region':'IN','dst':true,'time':'-5','desc':'NE Indiana: Fort Wayne (see 219)'},
    '262':{'Region':'WI','dst':true,'time':'-6','desc':'SE Wisconsin: counties of Kenosha, Ozaukee, Racine, Walworth, Washington, Waukesha (split from 414)'},
    '264':{'Region':null,'dst':true,'time':'-4','desc':'Anguilla (split from 809)'},
    '267':{'Region':'PA','dst':true,'time':'-5','desc':'SE Pennsylvania: Philadelphia (see 215)'},
    '268':{'Region':null,'dst':true,'time':'-4','desc':'Antigua and Barbuda (split from 809)'},
    '269':{'Region':'MI','dst':true,'time':'-5','desc':'SW Michigan: Kalamazoo, Saugatuck, Hastings, Battle Creek, Sturgis to Lake Michigan (split from 616)'},
    '270':{'Region':'KY','dst':true,'time':'-6','desc':'W Kentucky: Bowling Green, Paducah (split from 502)'},
    '276':{'Region':'VA','dst':true,'time':'-5','desc':'S and SW Virginia: Bristol, Stuart, Martinsville (split from 540; perm 9/1/01, mand 3/16/02)'},
    '278':{'Region':'MI','dst':true,'time':'-5','desc':'Michigan (overlaid on 734, SUSPENDED)'},
    '281':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: Houston Metro (split 713; overlay 832)'},
    '283':{'Region':'OH','dst':true,'time':'-5','desc':'SW Ohio: Cincinnati (cancelled: overlaid on 513)'},
    '284':{'Region':null,'dst':true,'time':'-4','desc':'British Virgin Islands (split from 809)'},
    '289':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: S Cent. Ontario: Greater Toronto Area -- Durham, Halton, Hamilton-Wentworth, Niagara, Peel, York, and southern Simcoe County (excluding Toronto -- overlaid on 905, eff 6/9/01)'},
    '301':{'Region':'MD','dst':true,'time':'-5','desc':'W Maryland: Silver Spring, Frederick, Camp Springs, Prince George\'s County (see 240)'},
    '302':{'Region':'DE','dst':true,'time':'-5','desc':'Delaware'},
    '303':{'Region':'CO','dst':true,'time':'-7','desc':'Central Colorado: Denver (see 970, also 720 overlay)'},
    '304':{'Region':'WV','dst':true,'time':'-5','desc':'West Virginia'},
    '305':{'Region':'FL','dst':true,'time':'-5','desc':'SE Florida: Miami, the Keys (see 786, 954; 239)'},
    '306':{'Region':'SK','dst':false,'time':'-6/-7','desc':'Canada: Saskatchewan'},
    '307':{'Region':'WY','dst':true,'time':'-7','desc':'Wyoming'},
    '308':{'Region':'NE','dst':true,'time':'-6/-7','desc':'W Nebraska: North Platte'},
    '309':{'Region':'IL','dst':true,'time':'-6','desc':'W Cent. Illinois: Peoria'},
    '310':{'Region':'CA','dst':true,'time':'-8','desc':'S California: Beverly Hills, West Hollywood, West Los Angeles (see split 562; overlay 424)'},
    '311':{'Region':null,'dst':null,'time':null,'desc':'Reserved for special applications'},
    '312':{'Region':'IL','dst':true,'time':'-6','desc':'Illinois: Chicago (downtown only -- in the loop; see 773; overlay 872)'},
    '313':{'Region':'MI','dst':true,'time':'-5','desc':'Michigan: Detroit and suburbs (see 734, overlay 679)'},
    '314':{'Region':'MO','dst':true,'time':'-6','desc':'SE Missouri: St Louis city and parts of the metro area only (see 573, 636, overlay 557)'},
    '315':{'Region':'NY','dst':true,'time':'-5','desc':'N Cent. New York: Syracuse'},
    '316':{'Region':'KS','dst':true,'time':'-6','desc':'S Kansas: Wichita (see split 620)'},
    '317':{'Region':'IN','dst':true,'time':'-5','desc':'Cent. Indiana: Indianapolis (see 765)'},
    '318':{'Region':'LA','dst':true,'time':'-6','desc':'N Louisiana: Shreveport, Ruston, Monroe, Alexandria (see split 337)'},
    '319':{'Region':'IA','dst':true,'time':'-6','desc':'E Iowa: Cedar Rapids (see split 563)'},
    '320':{'Region':'MN','dst':true,'time':'-6','desc':'Cent. Minnesota: Saint Cloud (rural Minn, excl St. Paul/Minneapolis)'},
    '321':{'Region':'FL','dst':true,'time':'-5','desc':'Florida: Brevard County, Cape Canaveral area; Metro Orlando (split from 407)'},
    '323':{'Region':'CA','dst':true,'time':'-8','desc':'S California: Los Angeles (outside downtown: Hollywood; split from 213)'},
    '325':{'Region':'TX','dst':true,'time':'-6','desc':'Central Texas: Abilene, Sweetwater, Snyder, San Angelo (split from 915)'},
    '330':{'Region':'OH','dst':true,'time':'-5','desc':'NE Ohio: Akron, Canton, Youngstown; Mahoning County, parts of Trumbull/Warren counties (see splits 216, 440, overlay 234)'},
    '331':{'Region':'IL','dst':true,'time':'-6','desc':'W NE Illinois, western suburbs of Chicago (part of what used to be 708; overlaid on 630; eff 7/07)'},
    '334':{'Region':'AL','dst':true,'time':'-6','desc':'S Alabama: Auburn/Opelika, Montgomery and coastal areas (part of what used to be 205; see also 256, split 251)'},
    '336':{'Region':'NC','dst':true,'time':'-5','desc':'Cent. North Carolina: Greensboro, Winston-Salem, High Point (split from 910)'},
    '337':{'Region':'LA','dst':true,'time':'-6','desc':'SW Louisiana: Lake Charles, Lafayette (see split 318)'},
    '339':{'Region':'MA','dst':true,'time':'-5','desc':'Massachusetts: Boston suburbs, to the south and west (see splits 617, 508; overlaid on 781, eff 5/2/01)'},
    '340':{'Region':'VI','dst':false,'time':'-4','desc':'US Virgin Islands (see also 809)'},
    '341':{'Region':'CA','dst':true,'time':'-8','desc':'(overlay on 510; SUSPENDED)'},
    '345':{'Region':null,'dst':true,'time':'-5','desc':'Cayman Islands'},
    '347':{'Region':'NY','dst':true,'time':'-5','desc':'New York (overlay for 718: NYC area, except Manhattan)'},
    '351':{'Region':'MA','dst':true,'time':'-5','desc':'Massachusetts: north of Boston to NH, 508, and 781 (overlaid on 978, eff 4/2/01)'},
    '352':{'Region':'FL','dst':true,'time':'-5','desc':'Florida: Gainesville area, Ocala, Crystal River (split from 904)'},
    '360':{'Region':'WA','dst':true,'time':'-8','desc':'W Washington State: Olympia, Bellingham (area circling 206, 253, and 425; split from 206; see overlay 564)'},
    '361':{'Region':'TX','dst':true,'time':'-6','desc':'S Texas: Corpus Christi (split from 512; eff 2/13/99)'},
    '369':{'Region':'CA','dst':true,'time':'-8','desc':'Solano County (perm 12/2/00, mand 6/2/01)'},
    '380':{'Region':'OH','dst':true,'time':'-5','desc':'Ohio: Columbus (overlaid on 614; assigned but not in use)'},
    '385':{'Region':'UT','dst':true,'time':'-7','desc':'Utah: Salt Lake City Metro (split from 801, eff 3/30/02 POSTPONED; see also 435)'},
    '386':{'Region':'FL','dst':true,'time':'-5','desc':'N central Florida: Lake City (split from 904, perm 2/15/01, mand 11/5/01)'},
    '401':{'Region':'RI','dst':true,'time':'-5','desc':'Rhode Island'},
    '402':{'Region':'NE','dst':true,'time':'-6','desc':'E Nebraska: Omaha, Lincoln'},
    '403':{'Region':'AB','dst':true,'time':'-7','desc':'Canada: Southern Alberta (see 780, 867)'},
    '404':{'Region':'GA','dst':true,'time':'-5','desc':'N Georgia: Atlanta and suburbs (see overlay 678, split 770)'},
    '405':{'Region':'OK','dst':true,'time':'-6','desc':'W Oklahoma: Oklahoma City (see 580)'},
    '406':{'Region':'MT','dst':true,'time':'-7','desc':'Montana'},
    '407':{'Region':'FL','dst':true,'time':'-5','desc':'Central Florida: Metro Orlando (see overlay 689, eff 7/02; split 321)'},
    '408':{'Region':'CA','dst':true,'time':'-8','desc':'Cent. Coastal California: San Jose (see overlay 669)'},
    '409':{'Region':'TX','dst':true,'time':'-6','desc':'SE Texas: Galveston, Port Arthur, Beaumont (splits 936, 979)'},
    '410':{'Region':'MD','dst':true,'time':'-5','desc':'E Maryland: Baltimore, Annapolis, Chesapeake Bay area, Ocean City (see 443)'},
    '411':{'Region':null,'dst':null,'time':null,'desc':'Reserved for special applications'},
    '412':{'Region':'PA','dst':true,'time':'-5','desc':'W Pennsylvania: Pittsburgh (see split 724, overlay 878)'},
    '413':{'Region':'MA','dst':true,'time':'-5','desc':'W Massachusetts: Springfield'},
    '414':{'Region':'WI','dst':true,'time':'-6','desc':'SE Wisconsin: Milwaukee County (see splits 920, 262)'},
    '415':{'Region':'CA','dst':true,'time':'-8','desc':'California: San Francisco County and Marin County on the north side of the Golden Gate Bridge, extending north to Sonoma County (see 650)'},
    '416':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: S Cent. Ontario: Toronto (see overlay 647, eff 3/5/01)'},
    '417':{'Region':'MO','dst':true,'time':'-6','desc':'SW Missouri: Springfield'},
    '418':{'Region':'QC','dst':true,'time':'-5/-4','desc':'Canada: NE Quebec: Quebec'},
    '419':{'Region':'OH','dst':true,'time':'-5','desc':'NW Ohio: Toledo (see overlay 567, perm 1/1/02)'},
    '423':{'Region':'TN','dst':true,'time':'-5','desc':'E Tennessee, except Knoxville metro area: Chattanooga, Bristol, Johnson City, Kingsport, Greeneville (see split 865; part of what used to be 615)'},
    '424':{'Region':'CA','dst':true,'time':'-8','desc':'S California: Los Angeles (see split 562; overlaid on 310 mand 7/26/06)'},
    '425':{'Region':'WA','dst':true,'time':'-8','desc':'Washington: North Tier - Everett, Bellevue (split from 206, see also 253; overlay 564)'},
    '430':{'Region':'TX','dst':true,'time':'-6','desc':'NE Texas: Tyler (overlaid on 903, eff 7/20/02)'},
    '432':{'Region':'TX','dst':true,'time':'-7/-6','desc':'W Texas: Big Spring, Midland, Odessa (split from 915, eff 4/5/03)'},
    '434':{'Region':'VA','dst':true,'time':'-5','desc':'E Virginia: Charlottesville, Lynchburg, Danville, South Boston, and Emporia (split from 804, eff 6/1/01; see also 757)'},
    '435':{'Region':'UT','dst':true,'time':'-7','desc':'Rural Utah outside Salt Lake City metro (see split 801)'},
    '438':{'Region':'QC','dst':true,'time':'-5','desc':'Canada: SW Quebec: Montreal city (overlaid on 514, [delayed until 6/06] eff 10/10/03, mand 2/7/04)'},
    '440':{'Region':'OH','dst':true,'time':'-5','desc':'Ohio: Cleveland metro area, excluding Cleveland (split from 216, see also 330)'},
    '441':{'Region':null,'dst':true,'time':'-4','desc':'Bermuda (part of what used to be 809)'},
    '442':{'Region':'CA','dst':true,'time':'-8','desc':'Far north suburbs of San Diego (Oceanside, Escondido, SUSPENDED -- originally perm 10/21/00, mand 4/14/01)'},
    '443':{'Region':'MD','dst':true,'time':'-5','desc':'E Maryland: Baltimore, Annapolis, Chesapeake Bay area, Ocean City (overlaid on 410)'},
    '450':{'Region':'QC','dst':true,'time':'-5/-4','desc':'Canada: Southeastern Quebec; suburbs outside metro Montreal'},
    '456':{'Region':null,'dst':null,'time':null,'desc':'Inbound International'},
    '464':{'Region':'IL','dst':true,'time':'-6','desc':'Illinois: south suburbs of Chicago (see 630; overlaid on 708)'},
    '469':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: Dallas Metro (overlays 214/972)'},
    '470':{'Region':'GA','dst':true,'time':'-5','desc':'Georgia: Greater Atlanta Metropolitan Area (overlaid on 404/770/678; mand 9/2/01)'},
    '473':{'Region':null,'dst':true,'time':'-4','desc':'Grenada ("new" -- split from 809)'},
    '475':{'Region':'CT','dst':true,'time':'-5','desc':'Connecticut: New Haven, Greenwich, southwestern (postponed; was perm 1/6/01; mand 3/1/01???)'},
    '478':{'Region':'GA','dst':true,'time':'-5','desc':'Central Georgia: Macon (split from 912; see also 229; perm 8/1/00; mand 8/1/01)'},
    '479':{'Region':'AR','dst':true,'time':'-6','desc':'NW Arkansas: Fort Smith, Fayetteville, Springdale, Bentonville (SPLIt from 501, perm 1/19/02, mand 7/20/02)'},
    '480':{'Region':'AZ','dst':false,'time':'-7','desc':'Arizona: East Phoenix (see 520; also Phoenix split 602, 623)'},
    '484':{'Region':'PA','dst':true,'time':'-5','desc':'SE Pennsylvania: Allentown, Bethlehem, Reading, West Chester, Norristown (see 610)'},
    '500':{'Region':null,'dst':null,'time':null,'desc':'Personal Communication Service'},
    '501':{'Region':'AR','dst':true,'time':'-6','desc':'Central Arkansas: Little Rock, Hot Springs, Conway (see split 479)'},
    '502':{'Region':'KY','dst':true,'time':'-5','desc':'N Central Kentucky: Louisville (see 270)'},
    '503':{'Region':'OR','dst':true,'time':'-8','desc':'Oregon (see 541, 971)'},
    '504':{'Region':'LA','dst':true,'time':'-6','desc':'E Louisiana: New Orleans metro area (see splits 225, 985)'},
    '505':{'Region':'NM','dst':true,'time':'-7','desc':'North central and northwestern New Mexico (Albuquerque, Santa Fe, Los Alamos; see split 575, eff 10/07/07)'},
    '506':{'Region':'NB','dst':true,'time':'-4','desc':'Canada: New Brunswick'},
    '507':{'Region':'MN','dst':true,'time':'-6','desc':'S Minnesota: Rochester, Mankato, Worthington'},
    '508':{'Region':'MA','dst':true,'time':'-5','desc':'Cent. Massachusetts: Framingham; Cape Cod (see split 978, overlay 774)'},
    '509':{'Region':'WA','dst':true,'time':'-8','desc':'E and Central Washington state: Spokane, Yakima, Walla Walla, Ellensburg'},
    '510':{'Region':'CA','dst':true,'time':'-8','desc':'California: Oakland, East Bay (see 925)'},
    '511':{'Region':null,'dst':null,'time':null,'desc':'Nationwide travel information'},
    '512':{'Region':'TX','dst':true,'time':'-6','desc':'S Texas: Austin (see split 361; overlay 737, perm 11/10/01)'},
    '513':{'Region':'OH','dst':true,'time':'-5','desc':'SW Ohio: Cincinnati (see split 937; overlay 283 cancelled)'},
    '514':{'Region':'QC','dst':true,'time':'-5','desc':'Canada: SW Quebec: Montreal city (see overlay 438, eff 10/10/03, mand 2/7/04)'},
    '515':{'Region':'IA','dst':true,'time':'-6','desc':'Cent. Iowa: Des Moines (see split 641)'},
    '516':{'Region':'NY','dst':true,'time':'-5','desc':'New York: Nassau County, Long Island; Hempstead (see split 631)'},
    '517':{'Region':'MI','dst':true,'time':'-5','desc':'Cent. Michigan: Lansing (see split 989)'},
    '518':{'Region':'NY','dst':true,'time':'-5','desc':'NE New York: Albany'},
    '519':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: SW Ontario: Windsor (see overlay 226)'},
    '520':{'Region':'AZ','dst':false,'time':'-7','desc':'SE Arizona: Tucson area (split from 602; see split 928)'},
    '530':{'Region':'CA','dst':true,'time':'-8','desc':'NE California: Eldorado County area, excluding Eldorado Hills itself: incl cities of Auburn, Chico, Redding, So. Lake Tahoe, Marysville, Nevada City/Grass Valley (split from 916)'},
    '540':{'Region':'VA','dst':true,'time':'-5','desc':'Western and Southwest Virginia: Shenandoah and Roanoke valleys: Fredericksburg, Harrisonburg, Roanoke, Salem, Lexington and nearby areas (see split 276; split from 703)'},
    '541':{'Region':'OR','dst':true,'time':'-8/-7','desc':'Oregon: Eugene, Medford (split from 503; 503 retains NW part [Portland/Salem], all else moves to 541; eastern oregon is UTC-7)'},
    '551':{'Region':'NJ','dst':true,'time':'-5','desc':'N New Jersey: Jersey City, Hackensack (overlaid on 201)'},
    '555':{'Region':null,'dst':null,'time':null,'desc':'Reserved for directory assistance applications'},
    '557':{'Region':'MO','dst':true,'time':'-6','desc':'SE Missouri: St Louis metro area only (cancelled: overlaid on 314)'},
    '559':{'Region':'CA','dst':true,'time':'-8','desc':'Central California: Fresno (split from 209)'},
    '561':{'Region':'FL','dst':true,'time':'-5','desc':'S. Central Florida: Palm Beach County (West Palm Beach, Boca Raton, Vero Beach; see split 772, eff 2/11/02; mand 11/11/02)'},
    '562':{'Region':'CA','dst':true,'time':'-8','desc':'California: Long Beach (split from 310 Los Angeles)'},
    '563':{'Region':'IA','dst':true,'time':'-6','desc':'E Iowa: Davenport, Dubuque (split from 319, eff 3/25/01)'},
    '564':{'Region':'WA','dst':true,'time':'-8','desc':'W Washington State: Olympia, Bellingham (overlaid on 360; see also 206, 253, 425; assigned but not in use)'},
    '567':{'Region':'OH','dst':true,'time':'-5','desc':'NW Ohio: Toledo (overlaid on 419, perm 1/1/02)'},
    '570':{'Region':'PA','dst':true,'time':'-5','desc':'NE and N Central Pennsylvania: Wilkes-Barre, Scranton (see 717)'},
    '571':{'Region':'VA','dst':true,'time':'-5','desc':'Northern Virginia: Arlington, McLean, Tysons Corner (to be overlaid on 703 3/1/00; see earlier split 540)'},
    '573':{'Region':'MO','dst':true,'time':'-6','desc':'SE Missouri: excluding St Louis metro area, includes Central/East Missouri, area between St. Louis and Kansas City'},
    '574':{'Region':'IN','dst':true,'time':'-5','desc':'N Indiana: Elkhart, South Bend (split from 219)'},
    '575':{'Region':'NM','dst':true,'time':'-7','desc':'New Mexico (Las Cruces, Alamogordo, Roswell; split from 505, eff 10/07/07)'},
    '580':{'Region':'OK','dst':true,'time':'-6','desc':'W Oklahoma (rural areas outside Oklahoma City; split from 405)'},
    '585':{'Region':'NY','dst':true,'time':'-5','desc':'NW New York: Rochester (split from 716)'},
    '586':{'Region':'MI','dst':true,'time':'-5','desc':'Michigan: Macomb County (split from 810; perm 9/22/01, mand 3/23/02)'},
    '600':{'Region':null,'dst':null,'time':null,'desc':'Canadian Services'},
    '601':{'Region':'MS','dst':true,'time':'-6','desc':'Mississippi: Meridian, Jackson area (see splits 228, 662; overlay 769)'},
    '602':{'Region':'AZ','dst':false,'time':'-7','desc':'Arizona: Phoenix (see 520; also Phoenix split 480, 623)'},
    '603':{'Region':'NH','dst':true,'time':'-5','desc':'New Hampshire'},
    '604':{'Region':'BC','dst':true,'time':'-8','desc':'Canada: British Columbia: Greater Vancouver (overlay 778, perm 11/3/01; see 250)'},
    '605':{'Region':'SD','dst':true,'time':'-6/-7','desc':'South Dakota'},
    '606':{'Region':'KY','dst':true,'time':'-5/-6','desc':'E Kentucky: area east of Frankfort: Ashland (see 859)'},
    '607':{'Region':'NY','dst':true,'time':'-5','desc':'S Cent. New York: Ithaca, Binghamton; Catskills'},
    '608':{'Region':'WI','dst':true,'time':'-6','desc':'SW Wisconsin: Madison'},
    '609':{'Region':'NJ','dst':true,'time':'-5','desc':'S New Jersey: Trenton (see 856)'},
    '610':{'Region':'PA','dst':true,'time':'-5','desc':'SE Pennsylvania: Allentown, Bethlehem, Reading, West Chester, Norristown (see overlays 484, 835)'},
    '611':{'Region':null,'dst':null,'time':null,'desc':'Reserved for special applications'},
    '612':{'Region':'MN','dst':true,'time':'-6','desc':'Cent. Minnesota: Minneapolis (split from St. Paul, see 651; see splits 763, 952)'},
    '613':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: SE Ontario: Ottawa'},
    '614':{'Region':'OH','dst':true,'time':'-5','desc':'SE Ohio: Columbus (see overlay 380)'},
    '615':{'Region':'TN','dst':true,'time':'-6','desc':'Northern Middle Tennessee: Nashville metro area (see 423, 931)'},
    '616':{'Region':'MI','dst':true,'time':'-5','desc':'W Michigan: Holland, Grand Haven, Greenville, Grand Rapids, Ionia (see split 269)'},
    '617':{'Region':'MA','dst':true,'time':'-5','desc':'Massachusetts: greater Boston (see overlay 857)'},
    '618':{'Region':'IL','dst':true,'time':'-6','desc':'S Illinois: Centralia'},
    '619':{'Region':'CA','dst':true,'time':'-8','desc':'S California: San Diego (see split 760; overlay 858, 935)'},
    '620':{'Region':'KS','dst':true,'time':'-6','desc':'S Kansas: Wichita (split from 316; perm 2/3/01)'},
    '623':{'Region':'AZ','dst':false,'time':'-7','desc':'Arizona: West Phoenix (see 520; also Phoenix split 480, 602)'},
    '626':{'Region':'CA','dst':true,'time':'-8','desc':'E S California: Pasadena (split from 818 Los Angeles)'},
    '627':{'Region':'CA','dst':true,'time':'-8','desc':'No longer in use [was Napa, Sonoma counties (perm 10/13/01, mand 4/13/02); now 707]'},
    '628':{'Region':'CA','dst':true,'time':'-8','desc':'(Region unknown; perm 10/21/00)'},
    '630':{'Region':'IL','dst':true,'time':'-6','desc':'W NE Illinois, western suburbs of Chicago (part of what used to be 708; overlay 331)'},
    '631':{'Region':'NY','dst':true,'time':'-5','desc':'New York: Suffolk County, Long Island; Huntington, Riverhead (split 516)'},
    '636':{'Region':'MO','dst':true,'time':'-6','desc':'Missouri: W St. Louis metro area of St. Louis county, St. Charles County, Jefferson County area south (between 314 and 573)'},
    '641':{'Region':'IA','dst':true,'time':'-6','desc':'Iowa: Mason City, Marshalltown, Creston, Ottumwa (split from 515; perm 7/9/00)'},
    '646':{'Region':'NY','dst':true,'time':'-5','desc':'New York (overlay 212/917) NYC: Manhattan only'},
    '647':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: S Cent. Ontario: Toronto (overlaid on 416; eff 3/5/01)'},
    '649':{'Region':null,'dst':true,'time':'-5','desc':'Turks & Caicos Islands'},
    '650':{'Region':'CA','dst':true,'time':'-8','desc':'California: Peninsula south of San Francisco -- San Mateo County, parts of Santa Clara County (split from 415)'},
    '651':{'Region':'MN','dst':true,'time':'-6','desc':'Cent. Minnesota: St. Paul (split from Minneapolis, see 612)'},
    '660':{'Region':'MO','dst':true,'time':'-6','desc':'N Missouri (split from 816)'},
    '661':{'Region':'CA','dst':true,'time':'-8','desc':'California: N Los Angeles, Mckittrick, Mojave, Newhall, Oildale, Palmdale, Taft, Tehachapi, Bakersfield, Earlimart, Lancaster (split from 805)'},
    '662':{'Region':'MS','dst':true,'time':'-6','desc':'N Mississippi: Tupelo, Grenada (split from 601)'},
    '664':{'Region':null,'dst':true,'time':'-4','desc':'Montserrat (split from 809)'},
    '669':{'Region':'CA','dst':true,'time':'-8','desc':'Cent. Coastal California: San Jose (rejected was: overlaid on 408)'},
    '670':{'Region':'MP','dst':false,'time':'+10','desc':'Commonwealth of the Northern Mariana Islands (CNMI, US Commonwealth)'},
    '671':{'Region':'GU','dst':false,'time':'+10','desc':'Guam'},
    '678':{'Region':'GA','dst':true,'time':'-5','desc':'N Georgia: metropolitan Atlanta (overlay; see 404, 770)'},
    '679':{'Region':'MI','dst':true,'time':'-5/-6','desc':'Michigan: Dearborn area (overlaid on 313; assigned but not in use)'},
    '682':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: Fort Worth areas (perm 10/7/00, mand 12/9/00)'},
    '684':{'Region':null,'dst':true,'time':'-11','desc':'American Samoa'},
    '689':{'Region':'FL','dst':true,'time':'-5','desc':'Central Florida: Metro Orlando (see overlay 321; overlaid on 407, assigned but not in use)'},
    '700':{'Region':null,'dst':null,'time':null,'desc':'Interexchange Carrier Services'},
    '701':{'Region':'ND','dst':true,'time':'-6','desc':'North Dakota'},
    '702':{'Region':'NV','dst':true,'time':'-8','desc':'S. Nevada: Clark County, incl Las Vegas (see 775)'},
    '703':{'Region':'VA','dst':true,'time':'-5','desc':'Northern Virginia: Arlington, McLean, Tysons Corner (see split 540; overlay 571)'},
    '704':{'Region':'NC','dst':true,'time':'-5','desc':'W North Carolina: Charlotte (see split 828, overlay 980)'},
    '705':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: NE Ontario: Sault Ste. Marie/N Ontario: N Bay, Sudbury'},
    '706':{'Region':'GA','dst':true,'time':'-5','desc':'N Georgia: Columbus, Augusta (see overlay 762)'},
    '707':{'Region':'CA','dst':true,'time':'-8','desc':'NW California: Santa Rosa, Napa, Vallejo, American Canyon, Fairfield'},
    '708':{'Region':'IL','dst':true,'time':'-6','desc':'Illinois: southern and western suburbs of Chicago (see 630; overlay 464)'},
    '709':{'Region':'NL','dst':true,'time':'-4/-3.5','desc':'Canada: Newfoundland and Labrador'},
    '710':{'Region':null,'dst':null,'time':null,'desc':'US Government'},
    '711':{'Region':null,'dst':null,'time':null,'desc':'Telecommunications Relay Services'},
    '712':{'Region':'IA','dst':true,'time':'-6','desc':'W Iowa: Council Bluffs'},
    '713':{'Region':'TX','dst':true,'time':'-6','desc':'Mid SE Texas: central Houston (split, 281; overlay 832)'},
    '714':{'Region':'CA','dst':true,'time':'-8','desc':'North and Central Orange County (see split 949)'},
    '715':{'Region':'WI','dst':true,'time':'-6','desc':'N Wisconsin: Eau Claire, Wausau, Superior'},
    '716':{'Region':'NY','dst':true,'time':'-5','desc':'NW New York: Buffalo (see split 585)'},
    '717':{'Region':'PA','dst':true,'time':'-5','desc':'E Pennsylvania: Harrisburg (see split 570)'},
    '718':{'Region':'NY','dst':true,'time':'-5','desc':'New York City, New York (Queens, Staten Island, The Bronx, and Brooklyn; see 212, 347)'},
    '719':{'Region':'CO','dst':true,'time':'-7','desc':'SE Colorado: Pueblo, Colorado Springs'},
    '720':{'Region':'CO','dst':true,'time':'-7','desc':'Central Colorado: Denver (overlaid on 303)'},
    '724':{'Region':'PA','dst':true,'time':'-5','desc':'SW Pennsylvania (areas outside metro Pittsburgh; split from 412)'},
    '727':{'Region':'FL','dst':true,'time':'-5','desc':'Florida Tampa Metro: Saint Petersburg, Clearwater (Pinellas and parts of Pasco County; split from 813)'},
    '731':{'Region':'TN','dst':true,'time':'-6','desc':'W Tennessee: outside Memphis metro area (split from 901, perm 2/12/01, mand 9/17/01)'},
    '732':{'Region':'NJ','dst':true,'time':'-5','desc':'Cent. New Jersey: Toms River, New Brunswick, Bound Brook (see overlay 848)'},
    '734':{'Region':'MI','dst':true,'time':'-5','desc':'SE Michigan: west and south of Detroit -- Ann Arbor, Monroe (split from 313)'},
    '737':{'Region':'TX','dst':true,'time':'-6','desc':'S Texas: Austin (overlaid on 512, suspended; see also 361)'},
    '740':{'Region':'OH','dst':true,'time':'-5','desc':'SE Ohio (rural areas outside Columbus; split from 614)'},
    '747':{'Region':'CA','dst':true,'time':'-8','desc':'S California: Los Angeles, Agoura Hills, Calabasas, Hidden Hills, and Westlake Village (see 818; implementation suspended)'},
    '754':{'Region':'FL','dst':true,'time':'-5','desc':'Florida: Broward County area, incl Ft. Lauderdale (overlaid on 954; perm 8/1/01, mand 9/1/01)'},
    '757':{'Region':'VA','dst':true,'time':'-5','desc':'E Virginia: Tidewater / Hampton Roads area -- Norfolk, Virginia Beach, Chesapeake, Portsmouth, Hampton, Newport News, Suffolk (part of what used to be 804)'},
    '758':{'Region':null,'dst':true,'time':'-4','desc':'St. Lucia (split from 809)'},
    '760':{'Region':'CA','dst':true,'time':'-8','desc':'California: San Diego North County to Sierra Nevada (split from 619)'},
    '762':{'Region':'GA','dst':true,'time':'-5','desc':'N Georgia: Columbus, Augusta (overlaid on 706)'},
    '763':{'Region':'MN','dst':true,'time':'-6','desc':'Minnesota: Minneapolis NW (split from 612; see also 952)'},
    '764':{'Region':'CA','dst':true,'time':'-8','desc':'(overlay on 650; SUSPENDED)'},
    '765':{'Region':'IN','dst':true,'time':'-5','desc':'Indiana: outside Indianapolis (split from 317)'},
    '767':{'Region':null,'dst':true,'time':'-4','desc':'Dominica (split from 809)'},
    '769':{'Region':'MS','dst':true,'time':'-6','desc':'Mississippi: Meridian, Jackson area (overlaid on 601; perm 7/19/04, mand 3/14/05)'},
    '770':{'Region':'GA','dst':true,'time':'-5','desc':'Georgia: Atlanta suburbs: outside of I-285 ring road (part of what used to be 404; see also overlay 678)'},
    '772':{'Region':'FL','dst':true,'time':'-5','desc':'S. Central Florida: St. Lucie, Martin, and Indian River counties (split from 561; eff 2/11/02; mand 11/11/02)'},
    '773':{'Region':'IL','dst':true,'time':'-6','desc':'Illinois: city of Chicago, outside the loop (see 312; overlay 872)'},
    '774':{'Region':'MA','dst':true,'time':'-5','desc':'Cent. Massachusetts: Framingham; Cape Cod (see split 978, overlaid on 508, eff 4/2/01)'},
    '775':{'Region':'NV','dst':true,'time':'-8','desc':'N. Nevada: Reno (all of NV except Clark County area; see 702)'},
    '778':{'Region':'BC','dst':true,'time':'-8','desc':'Canada: British Columbia: Greater Vancouver (overlaid on 604, per 11/3/01; see also 250)'},
    '779':{'Region':'IL','dst':true,'time':'-6','desc':'NW Illinois: Rockford, Kankakee (overlaid on 815; eff 8/19/06, mand 2/17/07)'},
    '780':{'Region':'AB','dst':true,'time':'-7','desc':'Canada: Northern Alberta, north of Lacombe (see 403)'},
    '781':{'Region':'MA','dst':true,'time':'-5','desc':'Massachusetts: Boston surburbs, to the north and west (see splits 617, 508; overlay 339)'},
    '784':{'Region':null,'dst':true,'time':'-4','desc':'St. Vincent & Grenadines (split from 809)'},
    '785':{'Region':'KS','dst':true,'time':'-6','desc':'N & W Kansas: Topeka (split from 913)'},
    '786':{'Region':'FL','dst':true,'time':'-5','desc':'SE Florida, Monroe County (Miami; overlaid on 305)'},
    '787':{'Region':'PR','dst':false,'time':'-4','desc':'Puerto Rico (see overlay 939, perm 8/1/01)'},
    '800':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free (see 888, 877, 866, 855, 844, 833, 822)'},
    '801':{'Region':'UT','dst':true,'time':'-7','desc':'Utah: Salt Lake City Metro (see split 385, eff 3/30/02; see also split 435)'},
    '802':{'Region':'VT','dst':true,'time':'-5','desc':'Vermont'},
    '803':{'Region':'SC','dst':true,'time':'-5','desc':'South Carolina: Columbia, Aiken, Sumter (see 843, 864)'},
    '804':{'Region':'VA','dst':true,'time':'-5','desc':'E Virginia: Richmond (see splits 757, 434)'},
    '805':{'Region':'CA','dst':true,'time':'-8','desc':'S Cent. and Cent. Coastal California: Ventura County, Santa Barbara County: San Luis Obispo, Thousand Oaks, Carpinteria, Santa Barbara, Santa Maria, Lompoc, Santa Ynez Valley / Solvang (see 661 split)'},
    '806':{'Region':'TX','dst':true,'time':'-6','desc':'Panhandle Texas: Amarillo, Lubbock'},
    '807':{'Region':'ON','dst':true,'time':'-5/-6','desc':'Canada: W Ontario: Thunder Bay region to Manitoba border'},
    '808':{'Region':'HI','dst':false,'time':'-10','desc':'Hawaii'},
    '809':{'Region':null,'dst':true,'time':'-4','desc':'Dominican Republic (see splits 264, 268, 284, 340, 441, 473, 664, 758, 767, 784, 868, 876; overlay 829)'},
    '810':{'Region':'MI','dst':true,'time':'-5','desc':'E Michigan: Flint, Pontiac (see 248; split 586)'},
    '811':{'Region':null,'dst':null,'time':null,'desc':'Reserved for special applications'},
    '812':{'Region':'IN','dst':true,'time':'-6/-5','desc':'S Indiana: Evansville, Cincinnati outskirts in IN, Columbus, Bloomington (mostly GMT-5)'},
    '813':{'Region':'FL','dst':true,'time':'-5','desc':'SW Florida: Tampa Metro (splits 727 St. Petersburg, Clearwater, and 941 Sarasota)'},
    '814':{'Region':'PA','dst':true,'time':'-5','desc':'Cent. Pennsylvania: Erie'},
    '815':{'Region':'IL','dst':true,'time':'-6','desc':'NW Illinois: Rockford, Kankakee (see overlay 779; eff 8/19/06, mand 2/17/07)'},
    '816':{'Region':'MO','dst':true,'time':'-6','desc':'N Missouri: Kansas City (see split 660, overlay 975)'},
    '817':{'Region':'TX','dst':true,'time':'-6','desc':'N Cent. Texas: Fort Worth area (see 254, 940)'},
    '818':{'Region':'CA','dst':true,'time':'-8','desc':'S California: Los Angeles: San Fernando Valley (see 213, 310, 562, 626, 747)'},
    '819':{'Region':'QC','dst':true,'time':'-5','desc':'NW Quebec: Trois Rivieres, Sherbrooke, Outaouais (Gatineau, Hull), and the Laurentians (up to St Jovite / Tremblant) (see 867)'},
    '822':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free (proposed, may not be in use yet)'},
    '828':{'Region':'NC','dst':true,'time':'-5','desc':'W North Carolina: Asheville (split from 704)'},
    '829':{'Region':null,'dst':true,'time':'-4','desc':'Dominican Republic (perm 1/31/05; mand 8/1/05; overlaid on 809)'},
    '830':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: region surrounding San Antonio (split from 210)'},
    '831':{'Region':'CA','dst':true,'time':'-8','desc':'California: central coast area from Santa Cruz through Monterey County'},
    '832':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: Houston (overlay 713/281)'},
    '833':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free (proposed, may not be in use yet)'},
    '835':{'Region':'PA','dst':true,'time':'-5','desc':'SE Pennsylvania: Allentown, Bethlehem, Reading, West Chester, Norristown (overlaid on 610, eff 5/1/01; see also 484)'},
    '843':{'Region':'SC','dst':true,'time':'-5','desc':'South Carolina, coastal area: Charleston, Beaufort, Myrtle Beach (split from 803)'},
    '844':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free (proposed, may not be in use yet)'},
    '845':{'Region':'NY','dst':true,'time':'-5','desc':'New York: Poughkeepsie; Nyack, Nanuet, Valley Cottage, New City, Putnam, Dutchess, Rockland, Orange, Ulster and parts of Sullivan counties in New York\'s lower Hudson Valley and Delaware County in the Catskills (see 914; perm 6/5/00)'},
    '847':{'Region':'IL','dst':true,'time':'-6','desc':'Northern NE Illinois: northwestern suburbs of chicago (Evanston, Waukegan, Northbrook; see overlay 224)'},
    '848':{'Region':'NJ','dst':true,'time':'-5','desc':'Cent. New Jersey: Toms River, New Brunswick, Bound Brook (see overlay 732)'},
    '850':{'Region':'FL','dst':true,'time':'-6/-5','desc':'Florida panhandle, from east of Tallahassee to Pensacola (split from 904); western panhandle (Pensacola, Panama City) are UTC-6'},
    '855':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free (proposed, may not be in use yet)'},
    '856':{'Region':'NJ','dst':true,'time':'-5','desc':'SW New Jersey: greater Camden area, Mt Laurel (split from 609)'},
    '857':{'Region':'MA','dst':true,'time':'-5','desc':'Massachusetts: greater Boston (overlaid on 617, eff 4/2/01)'},
    '858':{'Region':'CA','dst':true,'time':'-8','desc':'S California: San Diego (see split 760; overlay 619, 935)'},
    '859':{'Region':'KY','dst':true,'time':'-5','desc':'N and Central Kentucky: Lexington; suburban KY counties of Cincinnati OH metro area; Covington, Newport, Ft. Thomas, Ft. Wright, Florence (split from 606)'},
    '860':{'Region':'CT','dst':true,'time':'-5','desc':'Connecticut: areas outside of Fairfield and New Haven Counties (split from 203, overlay 959)'},
    '862':{'Region':'NJ','dst':true,'time':'-5','desc':'N New Jersey: Newark Paterson Morristown (overlaid on 973)'},
    '863':{'Region':'FL','dst':true,'time':'-5','desc':'Florida: Lakeland, Polk County (split from 941)'},
    '864':{'Region':'SC','dst':true,'time':'-5','desc':'South Carolina, upstate area: Greenville, Spartanburg (split from 803)'},
    '865':{'Region':'TN','dst':true,'time':'-5','desc':'E Tennessee: Knoxville, Knox and adjacent counties (split from 423; part of what used to be 615)'},
    '866':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free'},
    '867':{'Region':'YT','dst':true,'time':'-5/-6/-7/-8','desc':'Canada: Yukon, Northwest Territories, Nunavut (split from 403/819)'},
    '868':{'Region':null,'dst':true,'time':'-4','desc':'Trinidad and Tobago ("new" -- see 809)'},
    '869':{'Region':null,'dst':true,'time':'-4','desc':'St. Kitts & Nevis'},
    '870':{'Region':'AR','dst':true,'time':'-6','desc':'Arkansas: areas outside of west/central AR: Jonesboro, etc'},
    '872':{'Region':'IL','dst':true,'time':'-6','desc':'Illinois: Chicago (downtown only -- in the loop; see 773; overlaid on 312 and 773)'},
    '876':{'Region':null,'dst':true,'time':'-5','desc':'Jamaica (split from 809)'},
    '877':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free'},
    '878':{'Region':'PA','dst':true,'time':'-5','desc':'Pittsburgh, New Castle (overlaid on 412, perm 8/17/01, mand t.b.a.)'},
    '880':{'Region':null,'dst':null,'time':null,'desc':'Paid Toll-Free Service'},
    '881':{'Region':null,'dst':null,'time':null,'desc':'Paid Toll-Free Service'},
    '882':{'Region':null,'dst':null,'time':null,'desc':'Paid Toll-Free Service'},
    '888':{'Region':null,'dst':null,'time':null,'desc':'US/Canada toll free'},
    '898':{'Region':null,'dst':null,'time':null,'desc':'VoIP service'},
    '900':{'Region':null,'dst':null,'time':null,'desc':'US toll calls -- prices vary with the number called'},
    '901':{'Region':'TN','dst':true,'time':'-6','desc':'W Tennessee: Memphis metro area (see 615, 931, split 731)'},
    '902':{'Region':'NS','dst':true,'time':'-4','desc':'Canada: Nova Scotia, Prince Edward Island'},
    '903':{'Region':'TX','dst':true,'time':'-6','desc':'NE Texas: Tyler (see overlay 430, eff 7/20/02)'},
    '904':{'Region':'FL','dst':true,'time':'-5','desc':'N Florida: Jacksonville (see splits 352, 386, 850)'},
    '905':{'Region':'ON','dst':true,'time':'-5','desc':'Canada: S Cent. Ontario: Greater Toronto Area -- Durham, Halton, Hamilton-Wentworth, Niagara, Peel, York, and southern Simcoe County (excluding Toronto -- see overlay 289 [eff 6/9/01], splits 416, 647)'},
    '906':{'Region':'MI','dst':true,'time':'-6/-5','desc':'Upper Peninsula Michigan: Sault Ste. Marie, Escanaba, Marquette (UTC-6 towards the WI border)'},
    '907':{'Region':'AK','dst':true,'time':'-9','desc':'Alaska'},
    '908':{'Region':'NJ','dst':true,'time':'-5','desc':'Cent. New Jersey: Elizabeth, Basking Ridge, Somerville, Bridgewater, Bound Brook'},
    '909':{'Region':'CA','dst':true,'time':'-8','desc':'California: Inland empire: San Bernardino (see split 951), Riverside'},
    '910':{'Region':'NC','dst':true,'time':'-5','desc':'S Cent. North Carolina: Fayetteville, Wilmington (see 336)'},
    '911':{'Region':null,'dst':null,'time':null,'desc':'Emergency'},
    '912':{'Region':'GA','dst':true,'time':'-5','desc':'SE Georgia: Savannah (see splits 229, 478)'},
    '913':{'Region':'KS','dst':true,'time':'-6','desc':'Kansas: Kansas City area (see 785)'},
    '914':{'Region':'NY','dst':true,'time':'-5','desc':'S New York: Westchester County (see 845)'},
    '915':{'Region':'TX','dst':true,'time':'-7/-6','desc':'W Texas: El Paso (see splits 325 eff 4/5/03; 432, eff 4/5/03)'},
    '916':{'Region':'CA','dst':true,'time':'-8','desc':'NE California: Sacramento, Walnut Grove, Lincoln, Newcastle and El Dorado Hills (split to 530)'},
    '917':{'Region':'NY','dst':true,'time':'-5','desc':'New York: New York City (cellular, see 646)'},
    '918':{'Region':'OK','dst':true,'time':'-6','desc':'E Oklahoma: Tulsa'},
    '919':{'Region':'NC','dst':true,'time':'-5','desc':'E North Carolina: Raleigh (see split 252, overlay 984)'},
    '920':{'Region':'WI','dst':true,'time':'-6','desc':'NE Wisconsin: Appleton, Green Bay, Sheboygan, Fond du Lac (from Beaver Dam NE to Oshkosh, Appleton, and Door County; part of what used to be 414)'},
    '925':{'Region':'CA','dst':true,'time':'-8','desc':'California: Contra Costa area: Antioch, Concord, Pleasanton, Walnut Creek (split from 510)'},
    '927':{'Region':'FL','dst':true,'time':'-5','desc':'Florida: Cellular coverage in Orlando area'},
    '928':{'Region':'AZ','dst':false,'time':'-7','desc':'Central and Northern Arizona: Prescott, Flagstaff, Yuma (split from 520)'},
    '931':{'Region':'TN','dst':true,'time':'-6','desc':'Middle Tennessee: semi-circular ring around Nashville (split from 615)'},
    '935':{'Region':'CA','dst':true,'time':'-8','desc':'S California: San Diego (see split 760; overlay 858, 619; assigned but not in use)'},
    '936':{'Region':'TX','dst':true,'time':'-6','desc':'SE Texas: Conroe, Lufkin, Nacogdoches, Crockett (split from 409, see also 979)'},
    '937':{'Region':'OH','dst':true,'time':'-5','desc':'SW Ohio: Dayton (part of what used to be 513)'},
    '939':{'Region':'PR','dst':false,'time':'-4','desc':'Puerto Rico (overlaid on 787, perm 8/1/01)'},
    '940':{'Region':'TX','dst':true,'time':'-6','desc':'N Cent. Texas: Denton, Wichita Falls (split from 254, 817)'},
    '941':{'Region':'FL','dst':true,'time':'-5','desc':'SW Florida: Sarasota and Manatee counties (part of what used to be 813; see split 863)'},
    '947':{'Region':'MI','dst':true,'time':'-5/-6','desc':'Michigan: Oakland County (overlays 248, perm 5/5/01)'},
    '949':{'Region':'CA','dst':true,'time':'-8','desc':'California: S Coastal Orange County (split from 714)'},
    '951':{'Region':'CA','dst':true,'time':'-8','desc':'California: W Riverside County (split from 909; eff 7/17/04)'},
    '952':{'Region':'MN','dst':true,'time':'-6','desc':'Minnesota: Minneapolis SW, Bloomington (split from 612; see also 763)'},
    '954':{'Region':'FL','dst':true,'time':'-5','desc':'Florida: Broward County area, incl Ft. Lauderdale (part of what used to be 305, see overlay 754)'},
    '956':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: Valley of Texas area; Harlingen, Laredo (split from 210)'},
    '957':{'Region':'NM','dst':true,'time':'-7','desc':'New Mexico (pending; region unknown)'},
    '959':{'Region':'CT','dst':true,'time':'-5','desc':'Connecticut: Hartford, New London (postponed; was overlaid on 860 perm 1/6/01; mand 3/1/01???)'},
    '970':{'Region':'CO','dst':true,'time':'-7','desc':'N and W Colorado (part of what used to be 303)'},
    '971':{'Region':'OR','dst':true,'time':'-8','desc':'Oregon: Metropolitan Portland, Salem/Keizer area, incl Cricket Wireless (see 503; perm 10/1/00)'},
    '972':{'Region':'TX','dst':true,'time':'-6','desc':'Texas: Dallas Metro (overlays 214/469)'},
    '973':{'Region':'NJ','dst':true,'time':'-5','desc':'N New Jersey: Newark, Paterson, Morristown (see overlay 862; split from 201)'},
    '975':{'Region':'MO','dst':true,'time':'-6','desc':'N Missouri: Kansas City (overlaid on 816)'},
    '976':{'Region':null,'dst':null,'time':null,'desc':'Unassigned'},
    '978':{'Region':'MA','dst':true,'time':'-5','desc':'Massachusetts: north of Boston to NH (see split 978 -- this is the northern half of old 508; see overlay 351)'},
    '979':{'Region':'TX','dst':true,'time':'-6','desc':'SE Texas: Bryan, College Station, Bay City (split from 409, see also 936)'},
    '980':{'Region':'NC','dst':true,'time':'-5','desc':'North Carolina: (overlay on 704; perm 5/1/00, mand 3/15/01)'},
    '984':{'Region':'NC','dst':true,'time':'-5','desc':'E North Carolina: Raleigh (overlaid on 919, perm 8/1/01, mand 2/5/02 POSTPONED)'},
    '985':{'Region':'LA','dst':true,'time':'-6','desc':'E Louisiana: SE/N shore of Lake Pontchartrain: Hammond, Slidell, Covington, Amite, Kentwood, area SW of New Orleans, Houma, Thibodaux, Morgan City (split from 504; perm 2/12/01; mand 10/22/01)'},
    '989':{'Region':'MI','dst':true,'time':'-5','desc':'Upper central Michigan: Mt Pleasant, Saginaw (split from 517; perm 4/7/01)'},
    '999':{'Region':null,'dst':null,'time':null,'desc':'Often used by carriers to indicate that the area code information is unavailable for CNID, even though the rest of the number is present'}
};


ajas.Phone.parse=function(sPhone, bStrict, bWordy) {
    if(arguments.length < 2) var bStrict=true;
    if(arguments.length < 3) var bWordy=true;

    if (bWordy) { //replace letters with numbers
        sPhone = sPhone.replace(/[a-c]/ig, '2');
        sPhone = sPhone.replace(/[d-f]/ig, '3');
        sPhone = sPhone.replace(/[g-i]/ig, '4');
        sPhone = sPhone.replace(/[j-l]/ig, '5');
        sPhone = sPhone.replace(/[m-o]/ig, '6');
        sPhone = sPhone.replace(/[p-s]/ig, '7');
        sPhone = sPhone.replace(/[t-v]/ig, '8');
        sPhone = sPhone.replace(/[w-z]/ig, '9');
    }
    if (aBits = /[a-z]/i.exec(sPhone)) {
        throw new Error("Invalid Phone Number");
    }

    sPhone = sPhone.replace(/[^0-9]/ig, '');

    //we don't really want the leading 1 in eleven digit US numbers
    if (sPhone.length == 11 && sPhone.charAt(0) == 1) {
        sPhone=sPhone.substr(1,11);
    }

    //no one's number starts with 911!
    if (sPhone.substr(0,3) == '911') {
        throw new Error("Invalid Phone Number");
    }

    if (sPhone.length == 10) { // Full american phone number
        if (bStrict) {
            if (sPhone.charAt(0) < 2 ||       //0,1 reserved
                sPhone.charAt(1) == '9' ||    //N9X - expansion codes reserved
                sPhone.substr(1,2) == '11' || //service codes
                sPhone.substr(0,2) == '37' || //37X - reserved
                sPhone.substr(0,2) == '96') { //96X - reserved
                throw new Error("Invalid Area Code");
            }
            if (sPhone.charAt(3) < 2) {
                throw new Error("Invalid Exchange");
            }
        }

        return sPhone.substr(0,3)+'-'+sPhone.substr(3,3)+'-'+sPhone.substr(6,4);
    }
    if (!bStrict && sPhone.length == 7) { // Local american phone number
        return sPhone.substr(0,3)+'-'+sPhone.substr(3,4);
    }

    throw new Error("Invalid Phone Length");
};

//use this function to get a quiet true/false response
ajas.Phone.validate=function(oInput) {
    try {
        ajas.Phone.parse(oInput.value, true, false);
    } catch (e) {
        return false;
    }
    return true;
};
