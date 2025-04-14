import { notePathMap } from '../../../Map';

const metronome1 = "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Id1iHAAn1ArwXViOAP/7cGTjAfNMJEt7SUUoTW8olQQHqErYeyvn5TBgAAA/wAAABHkNSYNDZURyIxHJHgaY5AbeUyiM4GOgGmFlA2CAsGAeICShDiiyBotAuIlAg59FBzpxJ31X/ZD////6VKVKmdTVT5pCtR0SSLVC2S5tY9WIh2iHAS/AAAAhCwl+MNGplcxtbhP5Hy7cYYymw/khg6QCka5bRinyS1tyWGE6SJ3NmLaz///////////+9fCIDe+4qJkpEqmFj51xkN//+f/X///////+X/x3/51mOyiBqbVMjLt7+yIf0//7mP/ur9wy/k57GCj4tzpVBZBWNKHHznqAjXRJooWBsfw4Sk5syRlgLmBxgUlACG9AGhRljASNAq3NqZZwVnEC+wAx4HcoDCAwKVZgbd2RSSI4dSZARnR1kaL/+3Bk5oHy+xdKew9kiEtvOJAEB5xLcccn6YBdKAAAP8AAAAREFow+iJmJNKTUXjMokBKaZjb/Qdv///zvVtt2M6Ofr/Fuf03OCyOnTyh////loK/////////9+an/Vfv6Lo/9UJ5H6P////9brNkWlzOh60uLDqOQKHYQwCqxVEuUPIiQtATFHHWxUWxEswsI3EZUVIBOmkhAwTIWFf7hLmH+MAAAOkDgIOUH9Nz6PZapqYmyBkPkqHS+To+h3EVIiZnXOucYl58zdq//qOKd/////9fq1H3SakjbImhaKQ7jnKYdgUK///n+aAb////////60595v1+50U7HkVnOMlFWy1RJW7Irf379tX/663/nPtjFYN8Pb5ha1azxrho9vwsvj/e0gQW9XpyG+U7K4qBUqBJMRgqK//uAZO2Bsm0VSnnvMXhY71hwBCm+CSW7J+mAW2k+vWKUESc6qSTikSa6VimVCEqYWKiCUJt0gJdXF0cIDhvGgLgthAUAAYgMvDIDqrX+o4YSTFmlFI2HJIqYE0UhOhWPPnSmShokZtV/+gr//+T/1qxtnkMr5JnPMNdDjEGjkFhdCVQewsceLkcNIIisv//+s/l//////////ssv4u/p6erRYFKQmpgg////+fyZnvmfm312k5lNee/NvjcGtwL4I1L7uENp3T5q76148ICa64qjOGScZRA3Gkol3UsbaHH6iVVgBWdNxQAAL44ZAoucqhX6kUoOBY2mkThpDdetvWGWq/hsOf////////xJ9eqsPJM1jVgm6kZAxx5GVAj00HwAgB///98gtf////////8v/Zvms5s+ztfMKT7mzO+v///qZ2d+b93Xtkzu1mu3vp3qm1ca7YqL0yZ/cmBlceZJ9ZIPJJgMUI5KzNz/+4Bk8gHyS3hJamAXQGsPWGAET74KAecfqYC9CU09YkAQsvh4JFSkJLwrQR0L6Z2PZxsOQSsAdYBmQPGQsRRIwkDdE1TfugZJpHlOfMTOZOQNEt+6KBPGnVQX////3/2zfs2e//3ZndbM7GZPZ7blOjZ1lLtyAg84SZRC5AlFgRyLJCP//9//09fvb//Wleup79n/6N//+n+93aiszmOTONLmUc1SDnmnmEj1OH3JnBQeU8mJLEDglIExYI43Fg6TEkKjciJICxIAHHQZehtBRpAAB8gLkAmQ/clTpbHEg36jGz+tApDNDqMz963qPL6nP9f/////9+36/593/P/bf/k//6f9P6LmmLKdWUwqcw0awmKKQLDokJsCB9hYwcvG70JifCRpcD69kPGSodvxHVCXsjgcRiUcnb4z///cbowy/////////5qsWiaaTEbdm29kqdRGfIqmYiu2/ofv//+nf+9bxmm9UndwIv/7gGTqgfIGFMp7AUjoWA9YlQQsvoph5RupgNtJJzyigBAeMWMPm2L6OTy0rjGnjwb3jItvUsh8QG9uepdXENZFexq9zNNeLgeDC4ngEeRiRLq3Heb4voiTcVfGj2MsisBFAV4WADpuimaEzSXUpMydF0fzM1JhF0NqL/u79V////////9L63+T0mm/pv5f///1/6VrHexXBgI5WKFPCCxAUwtwphdY26kpAaXF6NxUPK1xcdxnA9wnhuHzgmiETiyzq2DpBf//8jVf/////////2f9CN1z9tNVbft1Q1KK/y7f///v/dMkhxZFKQkcKVsLvBB6FBooNIxSqgRkpmmMAsSiiYNCMBG0hCWBtCJ3gWiEzdjglDL41fjalrAAA6wK6AYCH7oF9aAuUWQaJtOMeUpdFqCU6XSmeJZ1p0Fa+5CtohB5v///////6//or7V/rX6f////0/5BSxhx0iyqUeg4TkmAZEFSIkuj//uQZPQBs256RMpFZnJqLzhgBE++TQ3nEymJmclQvOJUEqc5bbEAXTZVRmyBGimjWDp1CAJgXDBEdVJRCBREAeOt5//r/8wf//////////SltXKpXR6pq1yoQpHlUYpSVZrLy12fX//60+v81ix/bGdZ8LOfPmJLWd7Em7flwvmKtq9gcZWpVvJkYump4yrk0WI0VYXFVr87LhDilNUehQrSG0aUkYjBEgacZaIAbcAg2gA34HoCcCJJFsPgEIicMGu1X+fMUDg2x3l9NSKaKJpU6BuVa6nPkwZkAV///////+3/dujGXXSen+i/6///o3o3ReQY93c4oPO4xSDhdokcwkBWfcaaPDteVKlYwE9dGSCSgxnh8lHtIPUJ4fiQO0QMDwvK24hf//9iv///////////6N2ev9elfTr////+n//t39SHY7sW5zlMYYBDHDGFFMnRQyrTOHbz9GSO6VC06dumAnHNisVVxLHY3WC9cW4U6vrmm7AAJkzhJJDR5DazsZtEp9Ybs1JZh+sNcy/8OXa04+0gyzzu7t/+Gd/E//uQZOgBs417RMplTnBnr2hwBE++D7HrE6kVm4EyvOKUETM7UV2jXBjCRm/////8//8nstvvN+99dt0/////6NrtKg6KnM7IIGQ5HDjB4gw4aYYJrqH92vTttvtS+Vly5SYOrZM3lpJdfHEi3BkvDpYwpAAA8AP///JZ//////73dP1nkRHdKpIVXU9jHOcxirFu7qiszA0b+AogawB4A71nqjM4LqwmcTm7/+5e25AYFRC/wi0oTFE/NtMiIVMEIU4W1/////////0/6//+3//////6NuiUdPOS1TqCKRdG2RJ0OTM7ncgufDxQ1YhQY3UGbfUAAAjgT0CsBfcu84YvUZkaZJt6aqkTMly+TOghL5FyWNJggTaLL6kmSrUlV///X6ft//////////dbEouTex0crmMETfopiuc9mkMQ7NKY5w4AHf///fI5l////////9n+DzpchynTmEyudFMmQGY8+mxmhr5uUv//Gv8//082MUy+3vtdvMwUxhpo9hxfhn8RgXnr+sQ6KfFYcBTpfn+c6bJQpYCmUDR144B+//uAZNSB89Z6xMsFZnAgLzk4BAK+i0nVJeikSegAAD/AAAAEMzCf6qbY8Q4Q8OAP/wJQkxuR930UaqiUU3/NDEvhYPvJRBARPPAr9d/Jl////////////p1jAY9q3zQ1IoKGBQwB9sAB//+ExTEunQv////avLk1u10MdEBq9ZLkc1UD+UPClXdmVYYFjcAAABAA0iAD2NknZ900h5lN0/6khjDxGwpLrsbKLyrG6SX+//////6f///////poilsyI9Dtvuq3Srd2Q6WQFRXHExoJlAv4CyCNiJEWPsugmQ9JqJmaIf0jAxLRuUkDdqbXXTTLiSGb/////////9fX/W6ftrt/////9FX1Kc8iKpbgiDnEhlg3qQIMa8FZbdWnb6ixnVxe61y6ItL/UMhOEDSRkUsjPshdgWGVwV/wAAAB1gHoMAtdExEJyYK+hIi31ZPIlNlqRZBNLXZNaP///+z96OjH6vtaqFoKZT/+3Bk/gGSz3hJekAXGl+PWGAEL74HWGsr57UF4Ii6pLQQCvkyuikQZToAKzxoIpEKsCYA5rAY2LlNmzElTRFanTUvR16LUbLq99mdvznX//////3/d/+6ci2/T/J5f/////fdNnBUWjUIJmgxLCDOYFRqKEE2dNJuUFB5zIwS+AlaEBYPBuOEEzgraiEh///H/o///////////X/506ldq6dVP+javp77t///7b9T2dyouQggpHPEhEASGGIMIMXU/2O3HD/7Lefudj9DUq6SA4K7BwTzCiw0bXLFEHKZcGZ2d3/4AAAFmAfoAKmFykkj0UWWySdK6DUEkUHRS0Oklqpqd/000P////TXvslLPe1ZUNV0gztQEXNmACAH///rlif//////////1r1Qldqnqm6Jf9W1P/+//tQZP0B8kV4SfmgFjoAAA/wAAABDO3rFYkJmcAAAD/AAAAE3+v/9E7dUZ0MVXed0spWHoPKJEDgkCmGQIcFeLrSRpFey1erXGTXujiWxIOlpgdDIQyCoDFcxQlLsyuoOz78AP2A/0VEQoV0qCU1MX/dJPWpnNzr36cvpoH1KImVC4eT1ps39////T/+///////v/s66LtKVnX5W2s7LMx1KYsyuZYJroef//ooRkv/////1b9j2voqM97OQH0HzOGFZZTWq+kRYxgAAAh4JQP/7YGT7AbHteEl6QBZiAAAP8AAAAQwZ5RWJiTnJQT1iFBEzOAaeDcgdpNHGUiuhT6Gldp5M3TQ7VG54883I4gSy2yGyzItf////X+m7f/s7X9avVq9t+vP/z//O3+0hkXKkiBRRAxCiEoV5VIpnhjhH5TVcRuOu2HZwyLSGfpISyaL0xWXnzoXPlYZignHqaK3///39re6/Mj1Spna7lDqxzkOoQruO0MwKzgwTvgC6CXGEwxCz1HT5LonOzt8jRN4zYqQguj3MDEfJgOWTaJRMjWb9VMv//9P1fzf+jf/t/////2/Z0W8WZEeinKm6bPZwbnzDlKDJKcUm4ox////13ppvvf/7YGT0AbHodsn6YBbSVi9IlQSszsmJ3yfpAFqodLfkoBAK+yrJ3MyLczzO4LHIlbSUWqQAIcX+DixZ/ccM7kSrzV/n//71vLf47sUUPUsNZ5Y5YUtaNU9FdqV7Ci7IxGhf/////Zcv/zX8jR/r6h8/wr///M/35/dWe+uraWtXNnctutPWatq20rbVmpyi2FxoQozpKepnDJ46TiSwuZLqJLABUiLwRH1M8AIAP//r5kL+lP2r/0+nT/9f///+lG2ecaarKinKyGOw+OISAjJCw+OPESSs5hhGOOLhsh5IykoghLEwuQDpMKwtD4QIBUUEY8EqTEFNRTMuOTkuNaqqqqqqqv/7cGTmAfO3esTSYmbgFo8pIAACvgq52SXogFqoTjskwAAK+aqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+1Bk9Q/z1XrESwFmYEnPOIUECpxAAAH+AAAAIAAAP8AAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
const metronome2 = "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xaLv0+7pOVJi2gyZeoD3ID5cVli9CHI4z/XNLmpLK7deXXrFDF7TMoodmuZRXwDkoOh3/+Gv//27P/nO79V6CdU9zXvMioNBNzjr2d1Z4YQDX8aGg+nxykzrwKHC0Bc9aY7zGoZ5G28XEAjL+c8fFMsZFBK1aMpS8RSPHs8vCcPsl2Z3BuK7zn//////////OIVXiQ8rKPz809hBcG3/bb+A/8AAAJITGCStzpEpq08K71SsBuiaL78uB8Focdk2sYWrhjUDTaM2i+ElJIsI0s///////////noHy595U/zw1gXij4ThSqXd//tgZP4A9GZaTfsMRNgAAA/wAAABDRzPMewY9OAAAD/AAAAEWeGAA3FBPg5lCyM0rzNTFFFLUUqiFBCSECPYRGktn447VYLCMWf6r///////////7HNwHZ9RzZ8itlDlYkbAAACQXULQG0cMB8bU6nc4SQmo8xBwWo2JAFCG2PowwfAKMXWT1Mq//q/////6cylYjK6lprcQUohHKEJU0zCApXuCokQADImAL4LYRk4q0/////gwYLKbqLX1k7EPQqc/9w7b/x////qq3+f+q4uWyM8dkq6IWNGVdw58GnHg1tlphYXDxqLFxCEAMiEHpSuQAEYAPAqhfIVFm/+6kyeKZPEw//tQZPOB8zokSfn4YdgAAA/wAAABClB9J+ZhLKAAAD/AAAAESB9JVF+pv//5T/////6v7//9aoVtl2J6kXRPoRv///3ZvciMjHNYSRGuYQqHBwlEUKEHjhgkyw3ys5WH9LO6VmNVl86QvUQIa4vgaOYXjNhBYVt94ADRYA4jAsYRmbo//0WTmRWMkSZRG4j+f//wGP///+X/1z/oZb4HNZ7Op/+7///9GJZn9+6hXqpZcMjPyqdxguUiysgk+EHGkaBBb7kQxOGCEKRSemq+wP/7QGTsgfJSF0np7zD4AAAP8AAAAQdUTSnnhWRgAAA/wAAABLLKmyIVigpqiwIGk2F0ggAJJAFAAHYAoQ2fV//VRqWSBGmv+r////////+/zI3//7q12v7b/////1a3bvO+6GNV6yNEOccoM7AYOaI1haeNmk3RQU23I3EZgsipuTkxDbmEsRbAAAHCEH8DmRO4BQDgI12V//U7pMshhBb/etX//Vv////////tomn690/b//////tQZPMB8kZ5x2mgFtAAAA/wAAABCYXpF4eBF8gAAD/AAAAE9W92YmW5cmy0TdZ3IJldzHPRTflykINUU/OQxLAqiAFYGgjyJLISD+wACAAWkBEAGpjIC2HGRdv1q/1rRLzf/9P/////+rdP+9LT0/R1urderW3X/Xv//+mtWy1ZLkZVSaRavhlSMepL19UhWlSpITqpnCHO0mk9kyREzBSxSFhpMlWWsbIAAZ4CQAekhf0PoMB2L9v//03v+tH1MX6v/////////+nb+vro///7UGT+g/M3esRCRWZwAAAP8AAAAQyd6xEJhTfAAAA/wAAABG//////ci+26GLZzkQkEMVTuEpEmuSJqNc2QnORDnQTDmBHCiprnmgyli1ukYSAAQEAAAAzwHMAC4xayIoVnDA0///s3/9D1IIP9v9v9n/9n/f/////vuluXIimRHNEB6uYc5hQaaZFYTF2BhIaogLjEDgQEoeEjB8SPGCASDR4qDwZxppAAhgdDpQC2SRBzVjElzYllaH/+l//38qgCkf//////v+3//mfT+j/+1Bk7oHys3nFImJOcAAAD/AAAAEK1eUXiQjZyAAAP8AAAASm/b/////877SlS1D0SciBybHc444hEGGZ5COtjDjcegwXNgksYiAByTA2o9iE8VUCtAAKwE+ADUB1HGU6Jka6l0//6kkfofOtbQSN2SJIX//+v/+v5eR+NGpdjYCfE/Ob///////09z1cdncs9PuNujbdMprxZg5A17RxVs7bC7KaabTYqSQo4MJsFD0wEFZUoGSgXUg38KIBIGoAYAQFAOcJ8N9BJNtB0H/+//tQZO4B8uB6RMJiTnIAAA/wAAABCn3rF4mI2cAAAD/AAAAEv+h9mp+Vytf///6/g/9F5da5ZSPIXPzmX//////3+XrZ7dQnjEKjGkbUUtplrMcdw4kcQVSWeBZmc02TADHyxOqSHIRkKRDAjDDSARm4VY0EAAEWAAFIBtpDvJ3qb7f/opt+g+q+nOcj/////1////02R/n///t////+bXo0hFtOQxTpUyVqQhQiuZyK43Fptpqa2LqMMFTWHWrTEULPNpEBMrkZBAADKwGYSP/7UGTsAfK2eUXqYC6iAAAP8AAAAQrp6RWIiRnAAAA/wAAABIy0fV6//uo6Xlfot/R6Kv//9f/T///////+k5Sl0RdTHIzqjOLmOJlEhZTSIcVHMIOcXco8Xi9xcQHDjqASGHAONIJh8auqsAEMAEDEsIf/0T/6mt///+q//dWq5lJbh24Shh0LyWMLSHKGH4qagji5T4+FIQQBQ0NlEhsOAAqKAAMAGEFMNKc/JN/+s0z////////////q0nCTWJTQLQKJQixAFODhlYwCwQD/+2Bk6wHzR3rEyaFO0AAAD/AAAAEMaesRKYU3wAAAP8AAAAQYAAE+BOkPNG6zpeT9L///+kp////////Tr+jf/0ff//uX9f////0N63RXoeFPBg1Rwj2OUxghFPblOGHyBCyfXFVONrimSyFnWExwrp1FMlW2MAEuABrAkots+y02/////////////1l9fwYOMD8bPNpeaEfr8v////r+5ZC47lR2CssYrI+EJwtjIxadBDPumjmQpEsD6EdPQGxKsix0hg1rKcVGkIuRt2rwAACwAAmAGaK0HT//////1uT9Tk////+n9u2//ebLZu/6U3Xp9v0k/6ev127sT3YlhZmYZVL/+1Bk9QPyp3rFYiVOcAAAD/AAAAEJyecWhoC6iAAAP8AAAAS4cxijAxcKOJJRQ6pKoqPVJkB9bSNCn+Ht7ZtkgpucRBBwDHAMzI8ZVJunX////UyanUdL6ndvL//////1l/p/btL7/o1/vI2vRv/5/b9E9HaUQEYyhg6GZEBlgznVJQxW1VW3wIlieAhFBE9TrAggYIKFCiMwjKg7FAcKvyrsAAjgAAzAFQChFg3F1f///QQ/sbpOp0DqI/0Ep/////3/fb90plZrr9bptS3N//sgZPkB8ad4RcFARfIAAA/wAAABBXAJJeekAAAAAD/AAAAE7aM3//Y7eifsqI7q5lKiTo5JBQsPDjnKFKtPcrGQ2t4nUCA8m2jDxqc1hw+UQh0LkpQNkaqEbIwEQAxYAsJuCsCEI6Houl//UpVf6i4506jZaLepzf/t/9/SnV7P///7UGT3h/KuesViIk5wAAAP8AAAAQsV6xKJhTfAAAA/wAAABP////01el9WXYsyys7nESqsxFMjuUwkPKSom5RpRMYUaBYuOBlKQSYYLh4tuSAEwAANRzATUTAZVNnSRMn//9SX7LNUlqWj//5f/0f9v1Nr/zf////+jtp6sY30N1RWdDCLIpdQ6Q2xnQaBSFVnKio8pnEhYRFRIVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1Bk9gXypXpFSiJOcAAAD/AAAAEL1esTiYk5wAAAP8AAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQZPIB8yV5xMmiTnIAAA/wAAABCmHpGaaAuoAAAD/AAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7IGTsD/JkekTJoC4gAAAP8AAAAQAAAf4AAAAgAAA/wAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="

export class AudioPlayer {
	constructor() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext

		this.context = new AudioContext()
		this.buffers = {}
		this.audioNotes = []

		this.loadMetronomeSounds()
	}

	getContextTime() {
		return this.context.currentTime
	}
	getContext() {
		return this.context
	}
	isRunning() {
		return this.context.state == "running"
	}
	resume() {
		this.context.resume()
	}
	suspend() {
		this.context.suspend()
	}
	stopAllSources() {
		this.audioNotes.forEach(audioNote => {
			try {
				audioNote.stop(0)
			} catch (error) { }
		})
	}

	playCompleteNote(currentTime, note, playbackSpeed, volume, isPlayAlong, haveNodeVoice) {
		const buffer = this.buffers[note.noteNumber + 21]

		const source = this.context.createBufferSource();
		source.buffer = buffer;
		const gainNode = this.context.createGain();
		let gainValue = 2 * (note.velocity / 127) * volume

		if (haveNodeVoice) {
			gainNode.gain.value = gainValue;
			source.connect(gainNode);
			gainNode.connect(this.context.destination);

			source.start()
		}

		this.audioNotes.push(source)
	}

	playBeat(time, newMeasure) {
		if (!this.isRunning()) return
		const source = this.context.createBufferSource()
		source.buffer = newMeasure ? this.metronomSound1 : this.metronomSound2
		const gainNode = this.context.createGain()
		gainNode.gain.value = 0.5
		source.connect(gainNode)
		gainNode.connect(this.context.destination)

		source.start()
	}

	base64ToArrayBuffer(base64) {
		var binaryString = atob(base64);
		var bytes = new Uint8Array(binaryString.length);
		for (var i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}

	loadMetronomeSounds() {
		this.context.decodeAudioData(
			this.base64ToArrayBuffer(metronome1),
			data => (this.metronomSound1 = data)
		)

		this.context.decodeAudioData(
			this.base64ToArrayBuffer(metronome2),
			data => (this.metronomSound2 = data)
		)
	}

	async preloadAudioBuffers() {
		const buffers = {};
		for (const [note, audioPath] of Object.entries(notePathMap)) {
			const audioBuffer = await this.loadAudio(audioPath);
			buffers[note] = audioBuffer;
		}
		this.buffers = buffers;
	};

	async loadAudio(path) {
		const response = await fetch(path);
		const arrayBuffer = await response.arrayBuffer();
		return await this.context.decodeAudioData(arrayBuffer);
	};

	async loadBuffers() {
		this.loading = true
		this.preloadAudioBuffers()
		this.loading = false
	}
}
