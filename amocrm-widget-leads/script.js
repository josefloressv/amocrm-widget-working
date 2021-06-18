define(['jquery'], function ($) {
  var CustomWidget = function () {
    var self = this,
      system = self.system;
      self.cLead = []
    
    this.get_lead_info = function () // Collecting information from a contact card
    {
      console.log("get_lead_info area == " + self.system().area)
      
      if (self.system().area == 'lcard') {
        var lead = $('#person_n').attr('placeholder'),
          phones = $('#contacts_list .linked-form .control-phone__formatted'),
          emails = $('#contacts_list .linked-form input[data-type=email]:visible'),
          full_name = $('.control-fullname input:eq(0)').val() + " " + $('.control-fullname input:eq(1)').val(),
          pedido = $('#card_fields .linked-forms__group-wrapper_main div[data-id=1926474] .linked-form__field__value textarea').val(),
          direccion = $('#card_fields .linked-forms__group-wrapper_main div[data-id=1926476] .linked-form__field__value input').val(),                    
          data = [],
          c_phones = [], c_emails = [];

          for (var i = 0; i < phones.length; i++) {
          if ($(phones[i]).val().length > 0) {
            c_phones[i] = $(phones[i]).val();
          }
          }
          for (var i = 0; i < emails.length; i++) {
            if ($(emails[i]).val().length > 0) {
              c_emails[i] = $(emails[i]).val();
            }
          }

          data = {
            lead_no : lead,
            pedido : pedido,
            direccion : direccion,
            cliente : full_name,
            cliente_telefonos : c_phones,
            cliente_correos : c_emails
          }
        

          console.log(data)
          return data;
      } else {
        return false;
      }
    };

    this.WriteInWidget = function () {
      console.log("WriteInWidget in " + self.system().area)
      $('#js-ac-sub-lists-container').children().remove(); // The container is cleaned then the elements are collected in the container, selected in list.container - div block of widget, displayed in the right column.
      var row = '<p>' + self.cLead.lead_no +
                '<br/>Pedido: ' + self.cLead.pedido +
                '<br/><br/>Cliente: ' + self.cLead.cliente +
                '<br/>Direcci&oacute;n: ' + self.cLead.direccion +
                '<br/>Tel&eacute;fonos: '
                ;
      var i = 0;
      for(i=0; i< self.cLead.cliente_telefonos.length; i++) {
        row += self.cLead.cliente_telefonos[i] + ', ';
      }
      row += '<br/>Correos: ';
      for(i=0; i< self.cLead.cliente_correos.length; i++) {
        row += self.cLead.cliente_correos[i] + ', ';  
      }
      row += '</p>';
      $('#js-ac-sub-lists-container').append(row)
      row = ''        

      console.log(self.cLead)      
    };

    this.sendInfo = function () { // Sending collected information
      console.log("Sending....")
      console.log(JSON.stringify(self.cLead))
      console.log(self.get_settings().api_externa)
      self.crm_post(
        self.get_settings().api_externa,
        {
          // Sending POST data
          data : JSON.stringify(self.cLead)
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
        console.log('init area = ' + self.system().area)
        return true;
      },
      bind_actions: function () {
        console.log("binding actions function")
        console.log('binding area = ' + self.system().area)
        console.log(self.list_selected());
        return true;
      },
      render: function () {
        console.log('render function')
        console.log('render area = ' + self.system().area)
        if (self.system().area == 'lcard') {
          self.cLead = self.get_lead_info();

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
                   <div class="ac-form-button ac_sub">ENVIAR</div>\
                   </div>\
               <div class="ac-already-subs"></div>\
            <link type="text/css" rel="stylesheet" href="/upl/' + self.get_settings().widget_code + '/widget/style.css" >'
          });
                    
          //redefining click on render
          $('.ac-form-button').off('click')
          $('.ac-form-button').on('click', function () {
            console.log('click SEND')
            console.log(self.cLead)
            self.sendInfo();
          });
          self.WriteInWidget()
        }
        
        return true;
      },
      contacts: {
        selected: function () {          
        }
      },
      leads: {
        selected: function () {
        }
      },
      onSave: function () {

        return true;
      },
      loadPreloadedData: function () {
        console.log('loadPreloadedData function')
      },
      loadElements: function () {
        console.log('loadElements function')
      },
      linkCard: function () {
        console.log('linkCard function')
      },
      searchDataInCard: function () {
        console.log('searchDataInCard function')
      }
    };
    return this;
  };
  
  console.log(CustomWidget)

  return CustomWidget;
});