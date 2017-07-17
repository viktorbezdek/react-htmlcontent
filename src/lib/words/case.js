/*
	Corrects accidental uppercase

	Best-effort function to fix most common accidental uppercase errors, namely:
	[1] 2 first uppercase letters (ie. UPpercase)
	[2] Swapped cases (ie. uPPERCASE)

	Algorithm does not fix other uppercase eventualities,
	e.g. mixed case (UppERcaSe) as there are many cases for corporate brands
	that could potentially match the algorithm as false positive.

	@param {string} string — input text for identification
	@returns {string} — output with corrected accidental uppercase
*/
export function fixCase (string, locale) {
	/* [1] two first uppercase letters (i.e. UPpercase) */
  let pattern = '([^' + locale.allChars + ']|^)([' + locale.uppercaseChars + ']{2})([' + locale.lowercaseChars + ']{2,})'
  let re = new RegExp(pattern, 'g')

  string = string.replace(re, function ($0, $1, $2, $3) {
    return $1 + $2.substring(0, 1) + $2.substring(1).toLowerCase() + $3
  })

	/* [2.1] Swapped cases (2-letter cases, i.e. iT)
			Note that this is divided into 2 separate cases as \b in JavaScript regex
			does not take non-latin characters into a cosnideration
	*/
  pattern = '[' + locale.lowercaseChars + '][' + locale.uppercaseChars + ']\\b'
  re = new RegExp(pattern, 'g')
  string = string.replace(re, function (string) {
    return (string.substring(0, 1) + string.substring(1).toLowerCase())
  })

	/* [2.2] Swapped cases (n-letter cases, i.e. uPPERCASE) */
  pattern = '(\\b)([' + locale.lowercaseChars + '])([' + locale.uppercaseChars + ']{2,})'
  re = new RegExp(pattern, 'g')
  string = string.replace(re, function (string, $1, $2, $3) {
    return ($1 + $2 + $3.toLowerCase())
  })

  return string
}
