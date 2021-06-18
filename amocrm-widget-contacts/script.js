define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this,
      system = self.system;
      self.contacts = []
    
    this.get_ccard_info = function () // Collecting information from a contact card
    {
      console.log("get_cccard_info area == " + self.system().area)
      
      if (self.system().area == 'ccard') {
        var phones = $('#edit_card .control-phone input[type=text]:visible'),
          emails = $('#edit_card input[data-type=email]:visible'),
          full_name = $('.control-fullname input:eq(0)').val() + " " + $('.control-fullname input:eq(1)').val(),
          data = [],
          c_phones = [], c_emails = [];
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

        data = [{
          name : full_name,
          phones: c_phones,
          emails: c_emails
        }]
        console.log(data)
        return data;
      } else if (self.system().area == 'clist'){
        //contact lists
        var c_data = self.list_selected().selected;
        console.log(c_data)
        
          var data = [];
        c_data.forEach(function(element, index){
          data[index] = {
            name : 'name here',
            phones: element.phones,
            emails: element.emails
          }
        })
        console.log(data);
        return data;
      }else {
        return false;
      }
    };

    this.sendInfo = function () { // Sending collected information
      console.log("Sending....")
      console.log(JSON.stringify(self.contacts))
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

    this.WriteInWidget = function () {
      console.log("WriteInWidget in " + self.system().area)
      $('#js-ac-sub-lists-container').children().remove(); // The container is cleaned then the elements are collected in the container, selected in list.container - div block of widget, displayed in the right column.
      if ( self.system().area == 'ccard' || self.system().area == 'clist') {
        var row = ''

        self.contacts.forEach(function(element){
          row += '<p>Name: ' + element.name + '<br/>Emails: ';
          var i = 0;
          for(i=0; i< element.emails.length; i++) {
            row += element.emails[i] + ', ';  
          }
          row += '<br/>Phones: ';
          for(i=0; i< element.phones.length; i++) {
            row += element.phones[i] + ', ';
          }
          row += '</p>';
          $('#js-ac-sub-lists-container').append(row)
          row = ''        
        })        
      }
      console.log(self.contacts)      
    };

    this.callbacks = {
      settings: function () {
      },
      dpSettings: function () {
      },
      init: function () {
        console.log("init function")
        console.log('init area = ' + self.system().area)
        return true;
      },
      bind_actions: function () {
        console.log("binding actions function")
        console.log('binding area = ' + self.system().area)
        return true;
      },
      render: function () {
        console.log('render function')
        var lang = self.i18n('userLang');
        w_code = self.get_settings().widget_code; // in this case w_code='new-widget'
        if (typeof(AMOCRM.data.current_card) != 'undefined') {
          if (AMOCRM.data.current_card.id == 0) {
            console.log("GoWeb do not render")
            return false;
          } // do not render contacts/add || leads/add
        }
        console.log('rendering...')
        self.render_template({
          caption: {
            class_name: 'js-ac-caption',
            html: 'This is the caption'
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
        
        if ( self.system().area == 'ccard') {
          self.contacts = self.get_ccard_info();
        }

        if (self.system().area == 'ccard' || 'clist') {
          //redefining click on render
          $('.ac-form-button').off('click')
          $('.ac-form-button').on('click', function () {
            console.log('click SEND')
            console.log(self.contacts)
            console.log("binding Click in SEND")
            self.sendInfo();
          });
        }
        
        self.WriteInWidget()
        return true;
      },
      contacts: {
        selected: function () {    // Here is the behavior for multi-select contacts and click on the name of the widget
          console.log("selected contacts function")
          self.contacts = self.get_ccard_info();
          self.WriteInWidget()
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
  
  console.log(CustomWidget)

  return CustomWidget;
});