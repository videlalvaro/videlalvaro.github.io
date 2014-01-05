/**
 * THIS CODE PROBABLY HAS THE WORST USE OF JQUERY PROMISES
 * YOU'VE BEEN WARNED!!
 *
 * FOR A CLEANER IMPLEMENTATION SEE: https://gist.github.com/videlalvaro/8105837
 *
 **/

function add_to_alphabet(alphabet, ch) {
    if (alphabet.indexOf(ch) == -1) {
        alphabet.push(ch);
    }
}

/**
 * Adds 0s in front of the bits to
 **/
function pad_num(l, num) {
    return new Array(l - num.length + 1).join("0") + num;
}

function get_from_table(b, ch) {
    res = (b[ch] | 0);
    var deferred = $.Deferred();
    deferred.resolve(res);
    return deferred.promise();
}

function do_shift(d) {
    res = ((d << 1) | 1);
    var deferred = $.Deferred();
    deferred.resolve(res);
    return deferred.promise();
}

function do_and(d, matchMask) {
    ret = (d & matchMask);
    return ret;
}

function display_mask(letter, mask) {
    var letter_id = letter == '*' ? 'star' : letter;
    $("#bitmask-table").append('<li id="letter-' + letter_id + '"><span>' + letter + '</span>' + mask + '</li>');
}

function display_pattern(p) {
    display_letters(p, "#the-needle", "pattern-letter-");
}

function display_text(p) {
    display_letters(p, "#the-haystack", "text-letter-");
}

function display_letters(text, el, new_id) {
    text.split("").map(function (ch, i) {
        $(el).append('<span id="' + new_id + i + '" class="outer"><span class="inner">' + ch + '</span></span>');
    });
}

function enable_form() {
    $('#shiftand').find(':input:disabled').prop('disabled', false);
}

function eol(tl, text_index) {
    return tl == text_index + 1;
}

function flash_colors(id, bcolor, fcolor, duration) {
    return $(id).animate({backgroundColor: bcolor, color: fcolor}, duration).promise();
}

function toggle_colors(id, bcolor, fcolor, bcolor2, fcolor2, duration) {
    var deferred = $.Deferred();
    $.when(flash_colors(id, bcolor, fcolor, duration)).done(function () {
        $.when(flash_colors(id, bcolor2, fcolor2, duration)).done(function () {
            deferred.resolve();
        });
    });
    
    return deferred.promise();
}

function highlight_read_letter(text_index) {
    // this code brings the text previous letter to white
    if (text_index > 0) {
        $("#text-letter-" + (text_index - 1)).animate({backgroundColor: '#ffffff'}, 0);
    }
    // this code brings the text current letter to yellow
    $("#text-letter-" + text_index).animate({backgroundColor: 'yellow'}, 300).promise();
}

function char_for_bitmask(bitmasks, ch) {
    return bitmasks[ch] == undefined ? 'star' : ch;
}

function highlight_bitmask_row(b, ch) {
    // row from the bitmask table to highlight
    bitmask_row = "#letter-" + char_for_bitmask(b, ch);
    return toggle_colors(bitmask_row, 'red', '#ffffff', '#ffffff', '#000000', 500);
}

function highlight_pad_from_table() {
    return toggle_colors("#pad_from_table", 'red', '#ffffff', '#ffffff', '#000000', 500);
}

function highlight_pattern_letter(def, pat_letter_index, color) {
    var lettter = "#pattern-letter-" + pat_letter_index;
    $.when(flash_colors(lettter, color, '#ffffff', 500)).done(function () {
        def.resolve();
    });
}

function restore_pattern_letters(l) {
    for (var i = 0; i < l; i++) {
        flash_colors("#pattern-letter-" + i, '#ffffff', '#000000', 0);
    }
}

function initial_d() {
    return toggle_colors("#d_val", 'red', '#ffffff', '#ffffff', '#000000', 300);
}

function shift_op_animation() {
    return toggle_colors("#shift_op", 'red', '#ffffff', '#ffffff', '#000000', 300);
}

function first_step(l, shifted) {
    var def = $.Deferred();
    $.when(initial_d()).done(function () {
        $.when(shift_op_animation()).done(function () {
            $("div#match-run pre").html("");
            $("div#match-run pre").append('D:           <span id="d_val">' + pad_num(l, shifted.toString(2)) + '</span> <span id="shift_op"><< 1 | 1</span>\n');
            
            $.when(initial_d()).done(function () {
                def.resolve();
            });
        });
    });
    return def.promise();
}

function move_pattern_letters(def, tl, text_index) {
    if (!eol(tl, text_index)) {
        var needle_pos = $("#text-letter-" + (text_index + 1)).position();
        var needle_padding = parseInt($("#the-needle span :first").css('padding-left'), 10);

        $("#the-needle").animate({left: needle_pos.left + needle_padding}, 200, function () {
            def.resolve();
        });
    }
}

function highlight_match_result(pattern_pos) {
    var c = pattern_pos > -1 ? 'green' : 'red';
    return toggle_colors("#match_result", c, '#ffffff', '#ffffff', '#000000', 300);
}

/**
  * BEWARE: WHAT FOLLOWS IS ONE OF THE WORST JS PROGRAMS EVER WRITTEN.
 **/
function vis_shift_and(p, text) {
    $("#the-haystack").html("");
    $("#the-needle").html("").css('left', 'inherit');
    $("#bitmask-table").html("");
    $("#match-run pre").html("");

    var b = {};
    var l = p.length;
    var tl = text.length;
    var alphabet = [];

    // initialize bitmask table
    // build alphabet array
    for (var i = 0; i < l; i++) {
        var ch = p.charAt(i);
        add_to_alphabet(alphabet, ch);
        b[ch] = 0;
    }

    //build bitmask table;
    for (var i = 0; i < l; i++) {
        b[p.charAt(i)] = b[p.charAt(i)] | (1 << i);
    }

    for (var i = 0; i < alphabet.length; i++) {
        var padded = pad_num(l, b[alphabet[i]].toString(2));
        display_mask(alphabet[i], padded);
    }
    
    display_mask('*', pad_num(l, (0).toString(2)));

    display_text(text);
    display_pattern(p);
    
    tx_as_array = text.split("");

    var haystack_pos = $("#the-haystack").position();
    var d = 0;
    var matchMask = 1 << l-1;
    var text_index = 0;
    var pat_letter_index = -1;

    function read_next_char(d, matchMask, text_index) {
        var ch = tx_as_array.shift();

        $.when(do_shift(d), get_from_table(b, ch)).done(function(shifted, from_table) {
            var d2 = shifted & from_table;

            function display_shift_table() {
                var deferred = $.Deferred();
                var d2_padded = pad_num(l, d2.toString(2));
                var pattern_pos = d2_padded.indexOf("1");
                
                if (pattern_pos > -1) {
                    pat_letter_index = pat_letter_index + 1;
                }

                $("div#match-run pre").html("");
                $("div#match-run pre").append('D:           <span id="d_val">' + pad_num(l, d.toString(2)) + '</span> <span id="shift_op"><< 1 | 1</span>\n');

                // first_step: << 1 | 1 animation
                $.when(first_step(l, shifted)).done(function () {
                    $("div#match-run pre").append('Reading: ');

                    $.when(highlight_read_letter(text_index)).done(function (){
                        $("div#match-run pre").append('"' + ch + '"');

                        $.when(highlight_bitmask_row(b, ch)).done(function () {
                            $("div#match-run pre").append(' <span id="pad_from_table">' + pad_num(l, from_table.toString(2)) + "</span>\n");
                            $.when(highlight_pad_from_table()).done(function() {
                                $("div#match-run pre").append('D & "' + ch + '" mask <span id="match_result">' + d2_padded + "</span>\n");
                                $.when(highlight_match_result(pattern_pos)).done(function () {
                                    var pattern_anim = $.Deferred();
                                    if (pattern_pos > -1) {
                                        // change pattern color to green when prefixes are matched
                                        highlight_pattern_letter(pattern_anim, pat_letter_index, 'green');
                                    } else {
                                        // restore all the letters;
                                        $.when(flash_colors("#pattern-letter-" + (pat_letter_index + 1), 'red', '#ffffff', 500)).done(function () {
                                            pat_letter_index = -1;
                                            restore_pattern_letters(l, pattern_pos);
                                            move_pattern_letters(pattern_anim, tl, text_index);
                                        });
                                    }

                                    $.when(pattern_anim).done(function () {
                                        setTimeout(function(){
                                            deferred.resolve();
                                        }, 300);
                                    });
                                });
                            });
                        });
                    });
                });

                return deferred.promise();
            }

            $.when(display_shift_table()).done(function () {
                var matched = do_and(d2, matchMask);

                if (matched != 0) {
                    $("div#match-run pre").append("Match at: " + (text_index - l + 1));
                } else if (eol(tl, text_index)) {
                    $("div#match-run pre").append("No Match");
                } else {
                    read_next_char(d2, matchMask, text_index+1);
                }
                
                enable_form();
            })
        });
    }

    read_next_char(d, matchMask, text_index);
}