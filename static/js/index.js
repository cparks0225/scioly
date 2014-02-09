var selected_values = {
    'robot_zone':0,
    'jug_orientation':2,
    'jug_zone':'C',
    'lego_zone_d':0,
    'ping_zone_d':0,
    'battery_zone_d':0,
    'tennis_zone_d':0,
    'lego_zone_c':0,
    'ping_zone_c':0,
    'battery_zone_c':0,
    'tennis_zone_c':0,
    'lego_jug':0,
    'ping_jug':0,
    'battery_jug':0,
    'tennis_jug':0
}

function verify_item_numbers(trigger_item){
    var trigger_id = trigger_item.target.id;
    var trigger_id_len = trigger_id.length;
    var trigger_val = parseInt( trigger_item.target.value );

    for ( var i in selected_values ) {
        if ( i.indexOf('_zone_') != -1) {
            if ( i == trigger_id ){
                var opposing_zone = ((trigger_id.substring(trigger_id_len - 1, trigger_id_len)) == 'd' ) ? 'c':'d';
                var item_max = ( i.indexOf('tennis') == -1 ) ? 4:1;
                var opposing_val_max = (item_max - trigger_val);

                for ( var m = 1; m <= item_max; m++ ) {
                    var opposing_button_id = "#label_" + trigger_id.substring(0, trigger_id_len - 1) + opposing_zone + "_" + m;
                    $(opposing_button_id).removeClass( "disabled" );
                }
                for ( var m = opposing_val_max + 1; m <= item_max; m++ ) {
                    var opposing_button_id = "#label_" + trigger_id.substring(0, trigger_id_len - 1) + opposing_zone + "_" + m;
                    $(opposing_button_id).addClass( "disabled" );
                }
            }
        }
    };
};

function calculate_value(item_count, item_value, item_name, item_zone) {
    var items_in_jug = get_jug_item_count(item_name, item_zone);
    var multiplier = parseInt(selected_values['jug_orientation']);
    var pre_multiplier_score = item_count * item_value;
    var multiplier_score = items_in_jug * item_value * multiplier;
    if (items_in_jug > 0) {pre_multiplier_score -= (items_in_jug * item_value);}
    return pre_multiplier_score + multiplier_score;
}

var selected_values_functions = {
    'robot_zone': function(x) { return x },
    'jug_orientation': function(x) {return x },
    'jug_zone': function(x) {return x },
    'lego_zone_d': function(x) { return calculate_value( x, 2, 'lego', 'd' ) },
    'ping_zone_d': function(x) { return calculate_value( x, 4, 'ping', 'd' ) },
    'battery_zone_d': function(x) { return calculate_value( x, 6, 'battery', 'd' ) },
    'tennis_zone_d': function(x) { return calculate_value( x, 8, 'tennis', 'd' ) },
    'lego_zone_c': function(x) { return calculate_value( x, 1, 'lego', 'c' ) },
    'ping_zone_c': function(x) { return calculate_value( x, 2, 'ping', 'c' ) },
    'battery_zone_c': function(x) { return calculate_value( x, 3, 'battery', 'c' ) },
    'tennis_zone_c': function(x) { return calculate_value( x, 4, 'tennis', 'c' ) },
    'lego_jug': function(x) {return x },
    'ping_jug': function(x) {return x },
    'battery_jug': function(x) {return x },
    'tennis_jug': function(x) {return x }
}

function get_milk_jug_zone() {
    return selected_values['jug_zone'].toLowerCase()
};

function get_jug_item_count(i, zone) {
    return ( get_milk_jug_zone() == zone ) ? parseInt(selected_values[i + '_jug']): 0;
};

function get_zone_id(i) {
    var ret = i + '_zone_' + get_milk_jug_zone();
    return ret
};

function update_scores() {
    var lego_zone_score = selected_values[get_zone_id('lego')];
    var lego_zone_jug_count = get_jug_item_count('lego');
    var total = 0;
    for ( var i in selected_values ) {
        var value = selected_values_functions[ i ](selected_values[ i ]);
        if ( i.indexOf('jug') == -1 ) {
            total += parseInt(value);
        }
        $('#' + i + '_label').text( value );
    };

    $("#total_score").text( total );
};

function update_score(t) {
    verify_item_numbers(t);
    selected_values[t.target.id] = t.target.value;
    update_scores(t);
};

$(document).ready(function() {
    var radios = $(':radio').change(update_score);
});

function disable_zone_item(item_type, item_number, item_zone){
    var label_id = "#label_" + item_type + "_zone_" + item_zone + "_" + item_number;
};

function enable_zone_item(item_type, item_number, item_zone){
    var label_id = "#label_" + item_type + "_zone_" + item_zone + "_" + item_number;
    $(label_id).removeClass( item_state );
};

$(function(){
    $('#load_results').on('click', function(e){
        location = '/results';
    });
});

$(function(){
    $('#robocross_run').on('submit', function(e){
        e.preventDefault();
        var form_data = $('#robocross_run').serialize();
        form_data += '&total=' + $('#total_score').text();
        console.log( form_data );
        $.ajax({
            url: 'http://localhost:5000/results',
            type: 'POST',
            data: form_data,
            success: function(data){
                 alert('successfully submitted')
            }
        });
    });
});
