export type Locale =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "nl"
  | "pl"
  | "ru"
  | "ja"
  | "zh";

export interface CheckoutTranslations {
  dueToday: string;
  includesAccess: string;
  allPricesIn: string;
  license: string;
  subtotal: string;
  taxes: string;
  totalPrice: string;
  then: string;
  every: string;
  month: string;
  year: string;
  saveWithAnnual: string;
  annualDescription: string;
  switchToAnnual: string;
  switchToMonthly: string;
  monthlyDescription: string;
  paymentDetails: string;
  checkoutSettings: string;
  annualUpsell: string;
  discountInput: string;
  taxIdInput: string;
  checkoutLanguage: string;
}

export const checkoutTranslations: Record<Locale, CheckoutTranslations> = {
  en: {
    dueToday: "due today",
    includesAccess:
      "Includes full access to the product, plus all future updates. Add more seats, upgrade, pause or cancel your subscription at any time.",
    allPricesIn: "All prices in",
    license: "License",
    subtotal: "Subtotal",
    taxes: "Taxes",
    totalPrice: "Total price (due today)",
    then: "then",
    every: "every",
    month: "month",
    year: "year",
    saveWithAnnual: "Save 20% with annual billing",
    annualDescription:
      "Switch to annual billing and save 20% on your subscription. You'll still have full access to all features and can cancel anytime.",
    switchToAnnual: "Switch to annual billing",
    switchToMonthly: "Switch to monthly billing",
    monthlyDescription:
      "Switch to monthly billing for more flexibility. You can always switch back to annual billing later.",
    paymentDetails: "Payment details",
    checkoutSettings: "CHECKOUT SETTINGS",
    annualUpsell: "Annual Upsell",
    discountInput: "Discount Input",
    taxIdInput: "Tax ID Input",
    checkoutLanguage: "Checkout Language",
  },
  es: {
    dueToday: "a pagar hoy",
    includesAccess:
      "Incluye acceso completo al producto, además de todas las actualizaciones futuras. Agregue más usuarios, actualice, pause o cancele su suscripción en cualquier momento.",
    allPricesIn: "Todos los precios en",
    license: "Licencia",
    subtotal: "Subtotal",
    taxes: "Impuestos",
    totalPrice: "Precio total (a pagar hoy)",
    then: "luego",
    every: "cada",
    month: "mes",
    year: "año",
    saveWithAnnual: "Ahorre 20% con facturación anual",
    annualDescription:
      "Cambie a facturación anual y ahorre 20% en su suscripción. Seguirá teniendo acceso completo a todas las funciones y podrá cancelar en cualquier momento.",
    switchToAnnual: "Cambiar a facturación anual",
    switchToMonthly: "Cambiar a facturación mensual",
    monthlyDescription:
      "Cambie a facturación mensual para mayor flexibilidad. Siempre puede volver a la facturación anual más tarde.",
    paymentDetails: "Detalles de pago",
    checkoutSettings: "CONFIGURACIÓN DE PAGO",
    annualUpsell: "Venta adicional anual",
    discountInput: "Entrada de descuento",
    taxIdInput: "Entrada de ID fiscal",
    checkoutLanguage: "Idioma de pago",
  },
  fr: {
    dueToday: "à payer aujourd'hui",
    includesAccess:
      "Inclut un accès complet au produit, ainsi que toutes les mises à jour futures. Ajoutez plus d'utilisateurs, mettez à niveau, mettez en pause ou annulez votre abonnement à tout moment.",
    allPricesIn: "Tous les prix en",
    license: "Licence",
    subtotal: "Sous-total",
    taxes: "Taxes",
    totalPrice: "Prix total (à payer aujourd'hui)",
    then: "puis",
    every: "tous les",
    month: "mois",
    year: "ans",
    saveWithAnnual: "Économisez 20% avec la facturation annuelle",
    annualDescription:
      "Passez à la facturation annuelle et économisez 20% sur votre abonnement. Vous conserverez un accès complet à toutes les fonctionnalités et pourrez annuler à tout moment.",
    switchToAnnual: "Passer à la facturation annuelle",
    switchToMonthly: "Passer à la facturation mensuelle",
    monthlyDescription:
      "Passez à la facturation mensuelle pour plus de flexibilité. Vous pourrez toujours revenir à la facturation annuelle plus tard.",
    paymentDetails: "Détails du paiement",
    checkoutSettings: "PARAMÈTRES DE PAIEMENT",
    annualUpsell: "Vente incitative annuelle",
    discountInput: "Champ de remise",
    taxIdInput: "Champ d'ID fiscal",
    checkoutLanguage: "Langue de paiement",
  },
  de: {
    dueToday: "fällig heute",
    includesAccess:
      "Enthält vollen Zugang zum Produkt sowie alle zukünftigen Updates. Fügen Sie mehr Benutzer hinzu, upgraden, pausieren oder kündigen Sie Ihr Abonnement jederzeit.",
    allPricesIn: "Alle Preise in",
    license: "Lizenz",
    subtotal: "Zwischensumme",
    taxes: "Steuern",
    totalPrice: "Gesamtpreis (fällig heute)",
    then: "dann",
    every: "jeden",
    month: "Monat",
    year: "Jahr",
    saveWithAnnual: "Sparen Sie 20% bei jährlicher Abrechnung",
    annualDescription:
      "Wechseln Sie zur jährlichen Abrechnung und sparen Sie 20% bei Ihrem Abonnement. Sie behalten vollen Zugriff auf alle Funktionen und können jederzeit kündigen.",
    switchToAnnual: "Zur jährlichen Abrechnung wechseln",
    switchToMonthly: "Zur monatlichen Abrechnung wechseln",
    monthlyDescription:
      "Wechseln Sie zur monatlichen Abrechnung für mehr Flexibilität. Sie können jederzeit zur jährlichen Abrechnung zurückkehren.",
    paymentDetails: "Zahlungsdetails",
    checkoutSettings: "ZAHLUNGSEINSTELLUNGEN",
    annualUpsell: "Jährlicher Upsell",
    discountInput: "Rabattfeld",
    taxIdInput: "Steuer-ID-Feld",
    checkoutLanguage: "Zahlungssprache",
  },
  it: {
    dueToday: "da pagare oggi",
    includesAccess:
      "Include accesso completo al prodotto, oltre a tutti gli aggiornamenti futuri. Aggiungi più utenti, aggiorna, metti in pausa o annulla il tuo abbonamento in qualsiasi momento.",
    allPricesIn: "Tutti i prezzi in",
    license: "Licenza",
    subtotal: "Subtotale",
    taxes: "Tasse",
    totalPrice: "Prezzo totale (da pagare oggi)",
    then: "poi",
    every: "ogni",
    month: "mese",
    year: "anno",
    saveWithAnnual: "Risparmia il 20% con la fatturazione annuale",
    annualDescription:
      "Passa alla fatturazione annuale e risparmia il 20% sul tuo abbonamento. Manterrai l'accesso completo a tutte le funzionalità e potrai annullare in qualsiasi momento.",
    switchToAnnual: "Passa alla fatturazione annuale",
    switchToMonthly: "Passa alla fatturazione mensile",
    monthlyDescription:
      "Passa alla fatturazione mensile per maggiore flessibilità. Puoi sempre tornare alla fatturazione annuale in seguito.",
    paymentDetails: "Dettagli di pagamento",
    checkoutSettings: "IMPOSTAZIONI DI PAGAMENTO",
    annualUpsell: "Upsell annuale",
    discountInput: "Campo sconto",
    taxIdInput: "Campo ID fiscale",
    checkoutLanguage: "Lingua di pagamento",
  },
  pt: {
    dueToday: "a pagar hoje",
    includesAccess:
      "Inclui acesso completo ao produto, além de todas as atualizações futuras. Adicione mais usuários, atualize, pause ou cancele sua assinatura a qualquer momento.",
    allPricesIn: "Todos os preços em",
    license: "Licença",
    subtotal: "Subtotal",
    taxes: "Impostos",
    totalPrice: "Preço total (a pagar hoje)",
    then: "então",
    every: "a cada",
    month: "mês",
    year: "ano",
    saveWithAnnual: "Economize 20% com cobrança anual",
    annualDescription:
      "Mude para cobrança anual e economize 20% em sua assinatura. Você ainda terá acesso completo a todos os recursos e poderá cancelar a qualquer momento.",
    switchToAnnual: "Mudar para cobrança anual",
    switchToMonthly: "Mudar para cobrança mensal",
    monthlyDescription:
      "Mude para cobrança mensal para maior flexibilidade. Você sempre pode voltar para a cobrança anual mais tarde.",
    paymentDetails: "Detalhes do pagamento",
    checkoutSettings: "CONFIGURAÇÕES DE PAGAMENTO",
    annualUpsell: "Upsell anual",
    discountInput: "Campo de desconto",
    taxIdInput: "Campo de ID fiscal",
    checkoutLanguage: "Idioma de pagamento",
  },
  nl: {
    dueToday: "vandaag te betalen",
    includesAccess:
      "Bevat volledige toegang tot het product, plus alle toekomstige updates. Voeg meer gebruikers toe, upgrade, pauzeer of annuleer uw abonnement op elk moment.",
    allPricesIn: "Alle prijzen in",
    license: "Licentie",
    subtotal: "Subtotaal",
    taxes: "Belastingen",
    totalPrice: "Totaalprijs (vandaag te betalen)",
    then: "dan",
    every: "elke",
    month: "maand",
    year: "jaar",
    saveWithAnnual: "Bespaar 20% met jaarlijkse facturering",
    annualDescription:
      "Schakel over naar jaarlijkse facturering en bespaar 20% op uw abonnement. U behoudt volledige toegang tot alle functies en kunt op elk moment opzeggen.",
    switchToAnnual: "Overschakelen naar jaarlijkse facturering",
    switchToMonthly: "Overschakelen naar maandelijkse facturering",
    monthlyDescription:
      "Schakel over naar maandelijkse facturering voor meer flexibiliteit. U kunt altijd terugkeren naar jaarlijkse facturering.",
    paymentDetails: "Betalingsgegevens",
    checkoutSettings: "BETALINGSINSTELLINGEN",
    annualUpsell: "Jaarlijkse upsell",
    discountInput: "Kortingsveld",
    taxIdInput: "BTW-ID veld",
    checkoutLanguage: "Betalingsstaal",
  },
  pl: {
    dueToday: "do zapłaty dziś",
    includesAccess:
      "Zawiera pełny dostęp do produktu oraz wszystkie przyszłe aktualizacje. Dodaj więcej użytkowników, ulepsz, wstrzymaj lub anuluj swoją subskrypcję w dowolnym momencie.",
    allPricesIn: "Wszystkie ceny w",
    license: "Licencja",
    subtotal: "Suma częściowa",
    taxes: "Podatki",
    totalPrice: "Cena całkowita (do zapłaty dziś)",
    then: "następnie",
    every: "co",
    month: "miesiąc",
    year: "rok",
    saveWithAnnual: "Zaoszczędź 20% przy rozliczeniu rocznym",
    annualDescription:
      "Przejdź na rozliczenie roczne i zaoszczędź 20% na swojej subskrypcji. Zachowasz pełny dostęp do wszystkich funkcji i będziesz mógł anulować w dowolnym momencie.",
    switchToAnnual: "Przejdź na rozliczenie roczne",
    switchToMonthly: "Przejdź na rozliczenie miesięczne",
    monthlyDescription:
      "Przejdź na rozliczenie miesięczne, aby uzyskać większą elastyczność. Zawsze możesz wrócić do rozliczenia rocznego później.",
    paymentDetails: "Szczegóły płatności",
    checkoutSettings: "USTAWIENIA PŁATNOŚCI",
    annualUpsell: "Roczny upsell",
    discountInput: "Pole rabatu",
    taxIdInput: "Pole ID podatkowego",
    checkoutLanguage: "Język płatności",
  },
  ru: {
    dueToday: "к оплате сегодня",
    includesAccess:
      "Включает полный доступ к продукту, а также все будущие обновления. Добавляйте больше пользователей, обновляйте, приостанавливайте или отменяйте подписку в любое время.",
    allPricesIn: "Все цены в",
    license: "Лицензия",
    subtotal: "Промежуточный итог",
    taxes: "Налоги",
    totalPrice: "Общая цена (к оплате сегодня)",
    then: "затем",
    every: "каждый",
    month: "месяц",
    year: "год",
    saveWithAnnual: "Сэкономьте 20% при годовой оплате",
    annualDescription:
      "Перейдите на годовую оплату и сэкономьте 20% на подписке. Вы сохраните полный доступ ко всем функциям и сможете отменить в любое время.",
    switchToAnnual: "Перейти на годовую оплату",
    switchToMonthly: "Перейти на ежемесячную оплату",
    monthlyDescription:
      "Перейдите на ежемесячную оплату для большей гибкости. Вы всегда можете вернуться к годовой оплате позже.",
    paymentDetails: "Детали оплаты",
    checkoutSettings: "НАСТРОЙКИ ОПЛАТЫ",
    annualUpsell: "Годовой апсейл",
    discountInput: "Поле скидки",
    taxIdInput: "Поле налогового идентификатора",
    checkoutLanguage: "Язык оплаты",
  },
  ja: {
    dueToday: "本日支払い",
    includesAccess:
      "製品への完全なアクセスと、今後のすべてのアップデートが含まれます。ユーザーを追加したり、アップグレードしたり、サブスクリプションを一時停止またはキャンセルしたりすることができます。",
    allPricesIn: "すべての価格は",
    license: "ライセンス",
    subtotal: "小計",
    taxes: "税金",
    totalPrice: "合計金額（本日支払い）",
    then: "その後",
    every: "毎",
    month: "月",
    year: "年",
    saveWithAnnual: "年間請求で20%お得",
    annualDescription:
      "年間請求に切り替えて、サブスクリプションを20%お得に。すべての機能に完全にアクセスでき、いつでもキャンセルできます。",
    switchToAnnual: "年間請求に切り替える",
    switchToMonthly: "月次請求に切り替える",
    monthlyDescription:
      "より柔軟性を求める場合は、月次請求に切り替えてください。いつでも年間請求に戻すことができます。",
    paymentDetails: "支払い詳細",
    checkoutSettings: "チェックアウト設定",
    annualUpsell: "年間アップセル",
    discountInput: "割引入力",
    taxIdInput: "税務ID入力",
    checkoutLanguage: "チェックアウト言語",
  },
  zh: {
    dueToday: "今天到期",
    includesAccess:
      "包括对产品的完全访问权限，以及所有未来的更新。随时添加更多用户、升级、暂停或取消您的订阅。",
    allPricesIn: "所有价格均以",
    license: "许可证",
    subtotal: "小计",
    taxes: "税费",
    totalPrice: "总价（今天到期）",
    then: "然后",
    every: "每",
    month: "月",
    year: "年",
    saveWithAnnual: "年度计费可节省20%",
    annualDescription:
      "切换到年度计费，节省20%的订阅费用。您仍将完全访问所有功能，并可以随时取消。",
    switchToAnnual: "切换到年度计费",
    switchToMonthly: "切换到月度计费",
    monthlyDescription:
      "切换到月度计费以获得更大的灵活性。您随时可以切换回年度计费。",
    paymentDetails: "支付详情",
    checkoutSettings: "结账设置",
    annualUpsell: "年度追加销售",
    discountInput: "折扣输入",
    taxIdInput: "税务ID输入",
    checkoutLanguage: "结账语言",
  },
};
