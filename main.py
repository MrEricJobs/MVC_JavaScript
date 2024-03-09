# n, m = map(int, input().split())
#
# need_visited, visited = [], []
#
# for i in range(1, n+1):
#     need_visited.append([i, m-1, str(i), list(range(1, n+1))])
#
# while need_visited:
#     num, cost, arr, numbers = need_visited.pop()
#
#     numbers = numbers.copy()
#     numbers.remove(num)
#
#     if cost == 0:
#         visited.append(arr)
#         continue
#
#     for number in numbers:
#         need_visited.append([number, cost-1, arr+str(number), numbers])
#
# visited.reverse()
#
# for v in visited:
#     r = list(v)
#     print(' '.join(r))
#


# n, m = map(int, input().split())  # 자연수 n과, m 입력
# v    = [False] * (n + 1)          # 방문 표시 v 생성
# seq  = [''] * (m + 1)             # 수열 리스트 생성
#
# # 수열 생성/출력 함수
# # idx: seq[idx]번째 수를 생성
# def sequence(idx):
#     # 수열이 완성되면 출력
#     if idx == m + 1:
#         print(' '.join(seq[1:m+1]))
#         return
#
#     # 수열을 생성
#     for i in range(1, n + 1):
#         if v[i] is False:
#             v[i] = True        # 방문 표시
#             seq[idx] = str(i)  # 수열에 숫자 입력
#             sequence(idx + 1)  # 다음 수를 구함
#             v[i] = False       # 방문이 끝나면 표시 해제
#
#
# sequence(1)


n, m = map(int, input().split())
need_visited, visited = [], []
nums = list(map(int, input().split()))

for i in range(n):
    need_visited.append([nums[i], m-1, str(nums[i]), nums])

while need_visited:
    num, cost, arr, numbers = need_visited.pop()

    numbers = numbers.copy()
    numbers.remove(num)

    if cost == 0:
        visited.append(arr)
        continue

    for number in numbers:
        need_visited.append([number, cost-1, arr+str(number), numbers])

visited = list(set(visited))
visited.sort()

for v in visited:
    r = list(v)
    print(' '.join(r))



# n, m = map(int, input().split())
#
# need_visited, visited = [], []
#
# for i in range(1, n+1):
#     need_visited.append([i, m-1, str(i), list(range(1, n+1))])
#
# while need_visited:
#     num, cost, arr, numbers = need_visited.pop()
#
#     numbers = numbers.copy()
#     numbers.remove(num)
#
#     if cost == 0:
#         visited.append(arr)
#         continue
#
#     for number in numbers:
#         need_visited.append([number, cost-1, arr+str(number), numbers])
#
# visited.reverse()
#
# for v in visited:
#     r = list(v)
#     print(' '.join(r))


