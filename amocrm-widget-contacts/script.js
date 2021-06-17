define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this,
      system = self.system;
    
    console.log(system)

    this.get_ccard_info = function () // Collecting information from a contact card
    {
      console.log("area == " + self.system().area)

      if (self.system().area == 'ccard') {
        var phones = $('.card-cf-table-main-entity .phone_wrapper input[type=text]:visible'),
          emails = $('.card-cf-table-main-entity .email_wrapper input[type=text]:visible'),
          name = $('.card-top-name input').val(),
          data = [],
          c_phones = [], c_emails = [];
        data.name = name;
        for (var i = 0; i < phones.length; i++) {
          if ($(phones[i]).val().length > 0) {
            c_phones[i] = $(phones[i]).val();
          }
        }
        data['phones'] = c_phones;
        for (var i = 0; i < emails.length; i++) {
          if ($(emails[i]).val().length > 0) {
            c_emails[i] = $(emails[i]).val();
          }
        }
        data['emails'] = c_emails;
        get_ccard_info
        console.log(data)
        return data;
      }
      else {
        return false;
      }
    };

    this.sendInfo = function () { // Sending collected information
      console.log("Sending....")
      self.crm_post(
        'http://awslab.tech/amocrm.php',
        {
          // Sending POST data
          data : JSON.stringify(self.contacts)
        },
        function (msg) {
          console.log("ok response msg") //no escribe este log
          console.log(msg) //no escribe este log
        },
        'json',
        function (msg) {
          console.log("error response msg") //no escribe este log
          console.log(msg) //no escribe este log
        }
      );
      console.log("Luego del post....")
    };

    this.callbacks = {
      settings: function () {
      },
      dpSettings: function () {
      },
      init: function () {
        console.log("init function")
        if (self.system().area == 'ccard') {
          self.contacts = self.get_ccard_info();
          console.log("GoWeb Custommer contacts")
          console.log(self.contacts)
        }
        return true;
      },
      bind_actions: function () {
        console.log("Binding actions")
        if (self.system().area == 'ccard' || 'clist') {
          $('.ac-form-button').on('click', function () {
            console.log("Click in SEND")
            self.sendInfo();
          });
        }
        return true;
      },
      render: function () {
        var lang = self.i18n('userLang');
        w_code = self.get_settings().widget_code; // in this case w_code='new-widget'
        if (typeof(AMOCRM.data.current_card) != 'undefined') {
          if (AMOCRM.data.current_card.id == 0) {
            console.log("GoWeb do not render")
            return false;
          } // do not render contacts/add || leads/add
        }
        self.render_template({
          caption: {
            class_name: 'js-ac-caption',
            html: ''
          },
          body: '',
          render: '\
                 <div class="ac-form">\
             <div id="js-ac-sub-lists-container">\
             </div>\
                 <div id="js-ac-sub-subs-container">\
                 </div>\
                 <div class="ac-form-button ac_sub">SEND</div>\
                 </div>\
             <div class="ac-already-subs"></div>\
          <link type="text/css" rel="stylesheet" href="/upl/' + w_code + '/widget/style.css" >'
        });
        return true;
      },
      contacts: {
        selected: function () {    // Here is the behavior for multi-select contacts and click on the name of the widget
          console.log("Contact selected")
          var c_data = self.list_selected().selected;
          console.log(c_data)
          $('#js-sub-lists-container').children().remove(); // The container is cleaned then the elements are collected in the container, selected in list.container - div block of widget, displayed in the right column.
            var names = [], // Array of names
            length = c_data.length; // Number of selected id (counting starts from 0)
          for (var i = 0; i < length; i++) {
            names[i] = {
              emails: c_data[i].emails,
              phones: c_data[i].phones
            };
          }
          console.log(names);
          for (var i = 0; i < length; i++) {
            $('#js-ac-sub-lists-container').append('<p>Email:' + names[i].emails + ' Phone:' + names[i].phones + '</p>');
          }
          $(self.contacts).remove(); // clear the variable
          self.contacts = names;
        }
      },
      leads: {
        selected: function () {

        }
      },
      onSave: function () {

        return true;
      }
    };
    return this;
  };
  return CustomWidget;
});