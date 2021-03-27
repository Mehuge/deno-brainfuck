
async function brainfuck(p: string[]) {
	const b = new Uint8Array(1);
	const d = Array(30000).fill(0);
	const s: number [] = [];
	const o = [];
	let dp = 0;
	for (let ip = 0; ip < p.length; ip++) {
		// console.log(`ip ${ip} ${p[ip]} dp ${dp} ${d[dp]} -- s:[${s.join('<')}] o:[${o.join(' ')}]`);
		switch(p[ip]) {
		case '>': ++dp; break;
		case '<': --dp; break;
		case '+': d[dp] = d[dp] + 1; break;
		case '-': d[dp] = d[dp] - 1; break;
		case '.': o.push(d[dp]); break;
		case ',': d[dp] = await Deno.stdin.read(b) ? b[0] : -1; break;
		case '[':
			if (d[dp]) s.push(ip);
			else {
				let l = 0;
				while (p[++ip] != ']' || l > 0) {
					if (p[ip] == '[') l++;
					if (p[ip] == ']') l--;
				}
			}
			break;
		case ']': d[dp] ? (ip = s[s.length-1]) : s.pop(); break;
		}
	}
	const z = new Uint8Array(o.length);
	o.forEach((c, i) => z[i] = c);
	return new TextDecoder().decode(z);
}

// console.log(await brainfuck('++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.'.split('')));

const result = await brainfuck((await Deno.readTextFile(Deno.args[0])).split('').filter(c => "<>+-[],.".includes(c)));

if (result[result.length - 1] == '\n') {
	console.log(result.substring(0,result.length-1));
} else {
	console.log(result);
}
